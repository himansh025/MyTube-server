import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from '../utils/Apierror.js'
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudniary.js'
import { Apiresponse } from '../utils/Apiresponse.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose, { isValidObjectId } from "mongoose";
import {Video} from '../models/video.model.js'
// import Video from "../../../clientside/src/components/Video.jsx";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// import { UploadStream } from "cloudinary";

const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid)
    const refreshtoken = user.generateRefreshToken()
    const accesstoken = user.generateAccessToken()

    user.refreshtoken = refreshtoken
    await user.save({ validateBeforeSave: false })
    return { accesstoken, refreshtoken }


  } catch (error) {
    throw new ApiError(500, "somethng went wrog while generating refresh and access token")
  }

}

const registeruser = asyncHandler(async (req, res) => {
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
console.log(fullname,username);

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
    const genSalt = 8;
    const salt = await bcrypt.genSalt(genSalt);
    hashedpassword = await bcrypt.hash(password, salt);
    console.log(hashedpassword);
  }

  let avatarlocalpath;
  let coverimagelocalpath;

  if (req.files.avatar) {
    avatarlocalpath = req.files?.avatar[0]?.path;
  } else {
    throw new ApiError(400, "Req.file.avatar not found")
  }

  if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
    coverimagelocalpath = req.files.coverimage[0].path;
    console.log("coverimage", coverimagelocalpath);
  }


  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar image is req")
  }
  const avatar = await uploadOnCloudinary(avatarlocalpath)
  const coverimage = await uploadOnCloudinary(coverimagelocalpath)
  // console.log(`avatar ka  url ${avatar.url} ${coverimage.url}` );

  if (!avatar) {
    throw new ApiError(409, "avatar not found");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url,
    email,
    password: hashedpassword,
    username: username.toLowerCase()
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


  const createduser = await User.findById(user._id).select(
    "-password -refreshtoken"
  )
  console.log("created user", createduser);

  if (!createduser) {
    throw new ApiError(500, "something wents wrong while registering the user ")
  }

  return res.status(201).json(

    new Apiresponse(200, createduser, "user registered succesfully")
  )

});

const loginuser = asyncHandler(async (req, res) => {
  const { username, password, } = req.body;
  if(!username){
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }]
  })

  if (!user) {
    throw new ApiError(404, "user not found")
  }

  let passwordverify;
  const loginassword = user.password
  if (user) {
    passwordverify = await bcrypt.compare(password, loginassword)
  }

  if (passwordverify) {
    console.log("login");
  }

  const { accesstoken, refreshtoken } = await GenerateAccessandRefreshtoken(user._id)
  // console.log("accesstoken refreshtoken", accesstoken, refreshtoken);

  const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")
  // console.log("loggedin user", loggedinuser);

  // only modify by the server not the client
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new Apiresponse(200,
        {
          user: loggedinuser, accesstoken, refreshtoken
        }, "user logged in successfully"
      )
    )
})

const logoutuser = asyncHandler(async (req, res) => {
  console.log("ffedc", req.user);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: null
      }
    }
  )


  const options = {
    httpOnly: true,
    secure: true,
  }

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new Apiresponse(200, {}, "successfull logout"))
})

const refreshaccesstoken = asyncHandler(async (req, res) => {

  const IncomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken

  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized")
  }

  const DecodedToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(DecodedToken?._id)

  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }


  if (IncomingRefreshToken !== user.refreshtoken) {
    throw new ApiError(401, "token is used or expired")
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  const { accesstoken, Newrefreshtoken } = await GenerateAccessandRefreshtoken(user._id)


  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", Newrefreshtoken, options)
    .json(new Apiresponse(200,
      {
        accesstoken,
        refreshtoken: Newrefreshtoken
      },
      "refresh token generated"))

})

const passwordchange = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await bcrypt.compare(user.password, oldpassword)
  if (!isPasswordCorrect) {
    throw new ApiError(401, "old password is incorrect")
  }

  const salt = bcrypt.genSalt(8);
  const newhasedpassword = bcrypt.hash(newpassword, salt)
  console.log("newhasedpassword", newhasedpassword);
  user.password = newhasedpassword;
  await user.save();
  res
    .status(200)
    .json(new Apiresponse(200, {}, "password change successfully"))
})

const getcurrentuser = asyncHandler(async (req, res) => {
  const data = req.user// Assuming req.user is populated by your authentication middleware
console.log("data",data);


  if (!isValidObjectId(data)) { // Changed from `if(user)` to `if(!user)`
    throw new ApiError(404, 'User not found'); // Updated to send a 404 status code with the error
  }


  return res
    .status(200)
    .json(new Apiresponse(200,data,"successfully"))
})

const updateaccountdetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  // console.log(req.body);
  
  if (!fullname && !email) {
    throw new ApiError(400, "name and email are required")
  }

  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email
      }
    },
    { new: true }
  ).select('-password')
user.save()
  console.log("check res",user);
  

  res
    .status(200)
    .json(new Apiresponse(200, user, "account details update"))

})

const updatravatarimage = asyncHandler(async (req, res) => {

  const updateavatar = req.file.path;
  if (!updateavatar) {
    throw new ApiError(400, "update image cover is not found")
  }

  const avatar = await uploadOnCloudinary(updateavatar)
  // console.log("acatar check",avatar);
  
  if (!avatar.url) {
    throw new ApiError(500, "update avatar url missing")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:
      {
        avatar: avatar.url
      }
    },
    {
      new: true
    }).select("-password")
  user.save()
  res
    .status(200)
    .json(new Apiresponse(200, user, "avatar image update successfully"))
}
)

const updatecoverimage = asyncHandler(async (req, res) => {
  const updatecoverimage = req.file.path;
  if (!updatecoverimage) {
    throw new ApiError(400, "update image cover is not found")
  }

  const coverimage = await uploadOnCloudinary(updatecoverimage)
  console.log("coveriamge",coverimage);
  
  if (!coverimage.url) {
    throw new ApiError(500, "update coverimage url missing")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:
        { coverimage: coverimage.url }
    },
    {
      new: true
    }).select("-password")
  user.save()
  res
    .status(200)
    .json(new Apiresponse(200, user, "coverimage  update successfully"))
}
)


const userbyid=asyncHandler(async(req,res)=>{
  const {userId}= req.params;
  console.log("check c u",userId);
  
  if(!isValidObjectId(userId)){
    throw new ApiError("not found")

  }
const user= await User.findById(userId).select("-password")

// console.log("finaaly singleuser only",user);

res.json(200,new Apiresponse(200,user,"success"))

})

const getUserChannelsdetails = asyncHandler(async (req, res) => {
  const { username } = req.params;
  console.log("User ID for channel details:", username);

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing")
}


    const channel = await User.aggregate([
      {
        $match: {
          username:username?.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribed_to"
        }
      },
      {
        $addFields: {
          subscriberscount: { $size: "$subscribers" },
          subscribedtocount: { $size: "$subscribed_to" },
          is_Subscribed: {
            $cond: {
              if: {
                $in: [req.user?._id, "$subscribers.subscriber"] // Check if the user is in the subscribers list
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          subscriberscount: 1,
          subscribedtocount: 1,
          is_Subscribed: 1,
          avatar: 1,
          coverimage: 1,
          email: 1
        }
      }
    ]);

    // If no channel is found
    if (!channel?.length) {
      throw new ApiError(404, "Channel details not found");
    }

    // Send response
    res.status(200).json(new Apiresponse(200, channel[0], "User channel fetched successfully"));
  
});


const getwatchhistory= asyncHandler(async(req,res)=>{
  const user = User.aggregate([
    {
      $match: {
       _id: new mongoose.Types.ObjectId( req.user._id)
           
      }
    },{
      $lookup:{
        from: 'videos',
        localField: 'watchhistory',
        foreignField: '_id',
        as:"watchhistory",
        pipeline:[
          {
            $lookup:{
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as:"owner",
              pipeline:[
                {
                  $project:{
                    username:1,
                    avatar:1,
                    fullname:1
                  }
                }
              ]
            }
          },{
          $addFields :{
            owner:{
             $first:"$owner" 


            }
          }}
        ]
      }
    }
  ])

res
.status(200)
.json(new Apiresponse(200, user[0].watchhistory,"wathc history is succesfully get"))


})
const getUserChannelsdetailsbyusername = asyncHandler(async (req, res) => {
  const { videoid } = req.params;
  console.log("User ID or username for channel details:", videoid);

  // Validate if username or userId is provided
  if (!videoid) {
    throw new ApiError(500, "Username or UserID not provided");
  }

  // Determine if the provided identifier is a valid ObjectId or a username
  // let matchCriteria;
  // if (mongoose.Types.ObjectId.isValid(userid) && userid.length === 24) {
  //   // It's a valid ObjectId, match by _id
  //   matchCriteria = { _id: new mongoose.Types.ObjectId(userid) };
  // } else {
  //   // Otherwise, match by username
  //   matchCriteria = { username: userid.toLowerCase() };
  // }
  // console.log("matchCriteria:", matchCriteria);

  try {
    const channel = await User.aggregate([
      {
        $match:{ 
          videoid
        } // Use the entire matchCriteria object
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribed_to"
        }
      },
      {
        $addFields: {
          subscriberscount: { $size: "$subscribers" },
          subscribedtocount: { $size: "$subscribed_to" },
          is_Subscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          subscriberscount: 1,
          subscribedtocount: 1,
          is_Subscribed: 1,
          avatar: 1,
          coverimage: 1
        }
      }
    ]);

    if (!channel.length) {
      throw new ApiError(404, "Channel details not found");
    }

    res.status(200).json(new Apiresponse(200, channel[0], "User channel fetched successfully"));
  } catch (error) {
    console.error("Error fetching user channel details:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});



export { registeruser, loginuser, refreshaccesstoken, logoutuser, passwordchange, getcurrentuser, updateaccountdetails, updatecoverimage, updatravatarimage,getUserChannelsdetails,getwatchhistory,getUserChannelsdetailsbyusername,userbyid }