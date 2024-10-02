
import { Like } from '../models/like.model.js';
// import { User } from '../models/user.model.js'
import { Comment } from '../models/comment.model.js'
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

        if (!existingLike) {
            // Create a new like if it doesn't exist
            response = await Like.create({
                video: videoId,
                likedBy: userId,
                isLiked:true
            });
            console.log("Like created:", response);
        } else {
            // Remove the like if it already exists
            response = await Like.deleteOne({
                video: videoId,
                likedBy: userId,
                isLiked:false
            });
            console.log("Like removed:", response);
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
  

    const likeCount = await Like.countDocuments({
        video: videoId,
        isLiked: true,
    });

    // Count dislikes (where isLiked is false)
    const dislikeCount = await Like.countDocuments({
        video: videoId,
        isLiked: false,
    });

    // If no like or dislike documents are found for the video, handle the case
    if (likeCount === 0 && dislikeCount === 0) {
        return res.status(200).json(
            new Apiresponse(200, { likeCount: 0, dislikeCount: 0 }, "No likes or dislikes for this video yet")
        );
    }

    // Query the database to get the likes for the given video ID
    const getvideolike = await Like.findOne({
        video: videoId,
    }); // Pass videoId directly
    console.log("check b1", getvideolike);
    

    if (!getvideolike) {
      return res.status(200).json(
        new Apiresponse(200,{dislikeCount,likeCount }, "No likes for this video yet")
      );
    }
    console.log("uj",getvideolike);
    // let dislikeCount= getLikedVideos.length; 
    // If the video is found, respond with the like count
    return res.status(200).json(
      new Apiresponse(200, getvideolike,{likeCount,dislikeCount}, "Likes retrieved successfully")
    );
  });
  

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