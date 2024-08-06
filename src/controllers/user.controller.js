import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from '../utils/Apierror.js'
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudniary.js'
import {Apiresponse} from '../utils/Apiresponse.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { set } from "mongoose";
// import { UploadStream } from "cloudinary";

const GenerateAccessandRefreshtoken = async(userid)=>{
  try {
   const user = await User.findById(userid)
const refreshtoken = user.generateRefreshToken()
const accesstoken = user.generateAccessToken()

user.refreshtoken= refreshtoken
await user.save({validateBeforeSave:false})
return{ accesstoken,refreshtoken}


  } catch (error) {
   throw new ApiError(500,"somethng went wrog while generating refresh and access token")
  }

 } 

const registeruser = asyncHandler( async (req, res) => {
  // res.status(400).json({
  //       message:"wait"
  //   })

  // for register user points
  //  get user detail from frontend
  // validation - not empty
  // check if user already exists: username ,email
  //  check images avatar  check
  // upload  them to clodniary
  // create user obj - create entry in db
  //  remove  password and refresh token field from response
  //  check for user creation
  //   return res

  const { fullname, password, email, username } = req.body;

  // if(fullname===""){
  // throw new Apierror(400,"full name is required")
  // }

  // or

  if (
    [fullname, password, email, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "user with emaail or username alredy exist");
  }
  let hashedpassword;
if (password) {
  const genSalt= 8;
  const salt= await bcrypt.genSalt(genSalt);
  hashedpassword = await bcrypt.hash(password, salt);
  console.log(hashedpassword);
}

 let avatarlocalpath;
let coverimagelocalpath;

if(req.files.avatar){
  avatarlocalpath =  req.files?.avatar[0]?.path;
}else{
  throw new ApiError(400 , "Req.file.avatar not found")
}

if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
  coverimagelocalpath = req.files.coverimage[0].path;
  console.log("coverimage",coverimagelocalpath);
}


if(!avatarlocalpath ){
  throw new ApiError(400,"avatar image is req")
}
const avatar = await uploadOnCloudinary(avatarlocalpath)
const coverimage= await uploadOnCloudinary(coverimagelocalpath)
// console.log(`avatar ka  url ${avatar.url} ${coverimage.url}` );

if(!avatar){
  throw new ApiError(409, "avatar not found"); 
}

const user=  await User.create({
  fullname,
  avatar: avatar.url,
  coverimage:coverimage?.url,
  email,
  password :hashedpassword,
  username:username.toLowerCase()
})  

user.save();


//  function settoken(user){
//   const token = jwt.sign(
//     {
//        id: user.id,
//        username:user.username,
//        email:user.email
//        }, process.env.SECRET_KEY)
//        return token;
//       }

      
      //       function gettoken(token){
      //  const decoded = jwt.verify(token, process.env.SECRET_KEY);
      //  return decoded;
      //       }

        
        const createduser= await User.findById(user._id).select(
  "-password -refreshtoken"
)
console.log("created user",createduser);

if(!createduser){
  throw new ApiError(500, "something wents wrong while registering the user ")
}

return res.status(201).json(

  new Apiresponse(200,createduser,"user registered succesfully")
)

});

const loginuser= asyncHandler(async(req,res)=>{
  const {username,email,password} = req.body;
// if(!username || !email){
//   throw new ApiError(400, "username or email is required")
// }
console.log(email,username);

const user=await User.findOne({
$or: [{email,username}]
})

console.log(user);


if(!user){ 
  throw new ApiError(404, "user not found")
}


let passwordverify;
const loginassword= user.password
if(user){
    passwordverify=await bcrypt.compare(password,loginassword)
    console.log("password is right ",passwordverify);
  }

if(passwordverify){
  console.log("login");
}

const {accesstoken,refreshtoken}=  await GenerateAccessandRefreshtoken(user._id)
console.log("accesstoken refreshtoken",accesstoken,refreshtoken);

const loggedinuser= await User.findById(user._id).select("-password -refreshtoken")
console.log("loggedin user",loggedinuser);

// only modify by the server not the client
const options= {
  httpOnly: true,
  secure: true,
}
return res
.status(200)
.cookie("accesstoken",accesstoken,options)
.cookie("refreshtoken",refreshtoken,options)
.json(
  new Apiresponse(200,
    {
      user: loggedinuser,accesstoken,refreshtoken
    },"user logged in successfully"
  )
)

})

const logoutuser = asyncHandler( async(req,res)=>{
console.log( "ffedc",req.user);

 await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshtoken: null
    }
  }
)


const options= {
  httpOnly: true,
  secure: true,
}

res
.status(200)
.clearCookie("accesstoken",options)
.clearCookie("refreshtoken",options)
.json( new Apiresponse( 200,{ },"successfull logout"))
})

const refreshaccesstoken = asyncHandler( async(req,res)=>{

const IncomingRefreshToken =req.cookies.refreshtoken || req.body.refreshtoken

if(!IncomingRefreshToken){
  throw new ApiError(401,"unauthorized")
}

const DecodedToken= jwt.verify(IncomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
const user = await User.findById(DecodedToken?._id)

if(!user){
  throw new ApiError(401,"invalid refresh token")
}


if(IncomingRefreshToken !== user.refreshtoken){
  throw new ApiError(401,"token is used or expired")
}

const options={
  httpOnly :true,
  secure:true
}

 const {accesstoken,Newrefreshtoken}=await GenerateAccessandRefreshtoken(user._id)


 res
 .status(200)
 .cookie("accesstoken",accesstoken,options)
 .cookie("refreshtoken",Newrefreshtoken,options)
 .json( new Apiresponse(200,
  {accesstoken,
  refreshtoken:Newrefreshtoken},
   "refresh token generated"))

})

const passwordchange= asyncHandler(async(req,res)=>{
  const {oldpassword,newpassword}= req.body;
  const user = await User.findById(req.user?._id)
const isPasswordCorrect= await bcrypt.compare(user.password,oldpassword)
if(!isPasswordCorrect){
  throw new ApiError(401,"old password is incorrect")
}

const salt = bcrypt.genSalt(8);
const newhasedpassword= bcrypt.hash(newpassword,salt)
console.log("newhasedpassword",newhasedpassword);
user.password = newhasedpassword;
 await user.save();
 res
 .status(200)
 .json( new Apiresponse(200,{},"password change successfully"))
})

const getcurrentuser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200,req.user,"current user fetch successfully")
})

const updateaccountdetails= asyncHandler(async(req,res)=>{
  const {name,email}=req.body;
if(!name && !email){
  throw new ApiError(400,"name and email are required")
}

  const user =  User.findByIdAndUpdate(
    req.user?._id,
    {
   $set:{
      name,
      email
  }},
      {new:true}
  ).select('-password')

    
res
.status(200)
.json(new Apiresponse(200,user,"account details update"))

})



export { registeruser,loginuser,refreshaccesstoken,logoutuser,passwordchange,getcurrentuser,updateaccountdetails }