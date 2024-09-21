import { Comment } from '../models/comment.model.js';
import { asyncHandler } from '../utils/asynchandler.js'
import { ApiError } from '../utils/Apierror.js';
import { Apiresponse } from '../utils/Apiresponse.js';
import { isValidObjectId } from 'mongoose';

const getvideoComments = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoid)) {
        return new ApiError(400, "Invalid video ID");
    }

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ video: videoid })
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

    // If no comments found
    if (comments.length === 0) {
        return new ApiError(404, "No comments found for video with id ", videoid);
    }

    res
        .status(200)
        .json(new Apiresponse(200, comments, "All Comment Fetched Successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    const content = req.body
    const { commentid } = req.params;
    if (!isValidObjectId(commentid)) {
        throw new ApiError(500, " comment not found ")
    }

    if (content == "") {
        throw new ApiError(500, "content should not be empty")
    }
    const Comment = await Comment.create({
        content,
        owner: req.user?._id,
        video: videoid,
        // likedBy:,
    })

    if (!Comment) throw new ApiError(500, "Error while adding comment");

    const { username, avatar, fullName, _id } = req.user;

    const commentData = {
        ...Comment._doc,
        owner: { username, avatar, fullName, _id },
        likesCount: 0,
        isOwner: true,
    };


    req
        .status(200)
        .json(new Apiresponse(200, commentData, "comment added successfully"))
})


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