import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// mongooseaggregate is used to plugin
const TweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        }
        //     ,
        //     video: {
        //       type: Schema.Types.ObjectId,
        //       ref:"Video",
        //       required: true,
        //     },
        //     title: {
        //         type: Schema.Types.ObjectId,
        //         ref:"Video",
        //         required: true,
        //       },
        //       thumbnail: {
        //         type: Schema.Types.ObjectId,
        //         ref:"Video",
        //         required: true,
        //       },
        //       views: {
        //         type: Schema.Types.ObjectId,
        //         ref:"Video",
        //         required: true,
        //       }
    },

    { timestamps: true }
);


export const Tweet = mongoose.model("Tweet", TweetSchema);
