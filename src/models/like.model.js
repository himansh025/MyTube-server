import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// mongooseaggregate is used to plugin
const LikeSchema = new mongoose.Schema(
    {
        
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            required: true,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },
    },

    { timestamps: true }
);

// CommentSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model("Like", LikeSchema);
 