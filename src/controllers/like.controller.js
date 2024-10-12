
import { Like } from '../models/like.model.js';
// import { User } from '../models/user.model.js'
// import { Comment } from '../models/comment.model.js'
import { asyncHandler } from '../utils/asynchandler.js'
import { ApiError } from '../utils/Apierror.js';
import { Apiresponse } from '../utils/Apiresponse.js';
import { isValidObjectId } from 'mongoose';
const Liketoggle = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;
    console.log("userid",userId);
    

    // Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    try {
        // Check if the like document already exists
        const existingLike = await Like.findOne({
            video: videoId,
            likedBy: userId,
        });

        let response = null;
        console.log("existing like",existingLike);
        

        if (existingLike) {
            // Remove the like if it already exists
            response = await Like.deleteOne({_id:existingLike._id});
            // await response.save();
            console.log("Like removed:", response);
        } else {
            // Create a new like if it doesn't exist
            response = await Like.create({
                video: videoId,
                likedBy: userId
            });
            await response.save();
            console.log("Like created:", response);
        }

        res.status(200).json(new Apiresponse(200, response, "Successfully toggled like for the video"));
    } catch (error) {
        console.error("Error toggling like:", error);
        throw new ApiError(500, "An error occurred while toggling like");
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    // const content = req.body
    const { commentid } = req.params;
    if (!isValidObjectId(videoid)) {
        throw new ApiError(500, " commentid for commentlike not found ")
    }

   const checkCommentLike= await Like.findOne({
    $comment: commentid,
    likedBy:req.user._id
   })

   let response=null
   if(!checkCommentLike){
response = await Like.create({
    comment:commentid,
    likedBy:req.user?._id
})
   }
   else{
    response = await comment.deleteOne({
        videoid: videoid,
        likedBy:req.user?._id
    })
   }

    // if (!Like) throw new ApiError(500, "Error while adding Like");s

    const { username, avatar, fullName, _id } = req.user;

    const LikeData = {
        ...Like._doc,
        owner: { username, avatar, fullName, _id },
        likesCount: 0,
        isOwner: true,
    };


    req
        .status(200)
        .json(new Apiresponse(200, LikeData, "Like added successfully"))


})


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet


    if(!tweetId){
    throw new ApiError(400,"tweetid not get for like ")
}

if(!isValidObjectId(tweetId)){
    throw new ApiError(400,"tweetid not valid ")
}

const tweet = await Like.findOne({
    tweetId: tweetId,
    likedBy:req.user?._id
})
 
let response= null;
 if(!tweet) {
    const response = await Like.create({
        tweetId: tweetId,
        likedBy:req.user?._id
    })
 }else{
    const tweet = await Like.deleteOne({
        tweetId: tweetId,
        likedBy:req.user?._id
    })
 }
 response.save()
    return res.status(200)
    .json(
        new Apiresponse(
            200,
            response,
            "Toggled successfully"
        )
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    if(!req.user){
        throw new ApiError("User not found");
    }
    let likedVideos = await Like.find(
        {
            video: { $exists: true },
            likedBy:req.user?._id
        }
    ).populate({
        path:"video",
        select:"thumbnail title  duration owner"
    });

    if(!likedVideos){
        throw new ApiError(500 , "Something went wrong while getting the list")
    }

    return res.status(200)
    .json(
        new Apiresponse(
            200,
            likedVideos,
            "Liked Videos fetched successfully"
        )
    )
})

const getLikesOfVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // console.log("Likes for video:", videoId);
  
    // Validate if the videoId is a valid ObjectId
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }
  
    const getvideolike = await Like.find({
        video: videoId
    });
    
    console.log("check backend get vidoe like", getvideolike);
    
    // Calculate the length of the result (number of likes for the video)
    // const countlike = getLikedVideos.length;
    
    // console.log("Like count:",countlike );
    

 
    // const getvideolike = await Like.countDocuments({
    //     video: videoId,
    // });
    
    // console.log("Like count:", likeCount);
    
    return res.status(200).json(
      new Apiresponse(200,  getvideolike , "Likes retrieved successfully")
    )})
    
  

const getLikesOfCommentById = asyncHandler (async (req,res) =>{
    const {commentId} = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"commentid not found for like video")
    }
    const getcommentlike= await Like.findById(commentId)
    console.log(getcommentlike);
    
   if(!getcommentlike){
    throw new ApiError(400,"getcommentlike not found for like video in the db")
   }

    return res.status(200)
    .json(
        new Apiresponse(
            200 ,
            getcommentlike,
            "Comment likes fetched successfully"
        )
    )

    
})

const getLikesOfTweetById = asyncHandler (async (req,res) =>{
    const {tweetId} = req.params;
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId not found for like video")
    }
    const gettweetlike= await Like.findById(tweetId)
    console.log(gettweetlike);
    
   if(!gettweetlike){
    throw new ApiError(400,"video not found for like video in the db")
   }
   return res.status(200)
    .json(
        new Apiresponse(
            200 ,
            gettweetlike,
            "Comment likes fetched successfully"
        )
    )    
})

export { Liketoggle, toggleCommentLike, toggleTweetLike, getLikedVideos,getLikesOfVideoById,getLikesOfCommentById,getLikesOfTweetById }