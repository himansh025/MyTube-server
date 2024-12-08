import { Comment } from '../models/comment.model.js';
import { asyncHandler } from '../utils/asynchandler.js'
import { ApiError } from '../utils/Apierror.js';
import { Apiresponse } from '../utils/Apiresponse.js';
import { isValidObjectId,mongoose } from 'mongoose';

const getvideoComments = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    const { page = 1, limit = 10 } = req.query;
console.log("vid in backend for comment",videoid);

    if (!isValidObjectId(videoid)) {
        return new ApiError(400, "Invalid video ID");
    }

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ video: videoid })
        .skip(skip)
        .limit(parseInt(limit))
        .exec();
console.log("comments",comments);

    // If no comments found
    if (comments.length === 0) {
        return new ApiError(404, "No comments found for video with id ", videoid);
    }

    res
        .status(200)
        .json(new Apiresponse(200, comments, "All Comment Fetched Successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body; // Destructure content from request body
    const { commentid } = req.params; // Comment ID from params

    // Validate comment ID (video or parent comment ID)
    if (!mongoose.Types.ObjectId.isValid(commentid)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Ensure content is not empty or missing
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content should not be empty");
    }

    // Create new comment
    const newComment = await Comment.create({
        content,
        owner: req.user._id, // Set the user ID from logged-in user
        video: commentid,
        likedBy:req.user._id // Assuming `commentid` is the video ID or parent comment ID
    });

    if (!newComment) {
        throw new ApiError(500, "Error while adding comment");
    }

    // Extract user info for response
    const { username, avatar, fullName, _id } = req.user;

    // Format comment data for response
    const commentData = {
        ...newComment._doc,
        owner: { username, avatar, fullName, _id }, // Attach user details to the comment
        likesCount: 0, // Initialize likes count
        isOwner: true, // Mark current user as the owner
    };

    // Return success response
    res.status(200).json(new Apiresponse(200, commentData, "Comment added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
    const content = req.body
    const { commentid } = req.params;

    if (!isValidObjectId(commentid)) {
        throw new ApiError(500, "not found")
    }

    if (content == "") {
        throw new ApiError(500, "update Comment should not empty ")
    }

    const updatedcomment = await Comment.findByIdAndUpdate(
        commentid, {
        $set: {
            content: content
        }
    },
        {
            new: true
        }
    )
    // updatedcomment.save();
    req
        .status(200)
        .json(new Apiresponse(200, updatedcomment, "updatedcomment added successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentid } = req.params;

    if (!isValidObjectId(commentid)) {
        throw new ApiError(500, "videoid ist for delte comnt")
    }

    const comment = await Comment.findByIdAndDelete(commentid)

    if (!comment) throw new ApiError(500, "Error while deleting comment");

    const deleteLikes = await Like.deleteMany({
        comment: commentid,
    });
    req
        .status(200)
        .json(new Apiresponse(200, { deleteLikes, comment }, "comment added successfully"))
})

export { addComment, deleteComment, updateComment, getvideoComments }