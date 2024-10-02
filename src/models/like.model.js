import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Mongoose aggregate pagination plugin

const LikeSchema = new mongoose.Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: function () {
                return !this.tweet && !this.comment;
            },
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            required: function () {
                return !this.video && !this.comment;
            },
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: function () {
                return !this.video && !this.tweet;
            },
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isLiked: {  // New field to differentiate between likes and dislikes
            type: Boolean,
            required: true, // true for like, false for dislike
        },
    },
    { timestamps: true }
);

// Add pagination capabilities to the Like model
LikeSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model("Like", LikeSchema);
