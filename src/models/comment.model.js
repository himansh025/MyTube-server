import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {

    content: {
      type: String,
      required: true,
    },
    owner: {
      type:Schema.Types.ObjectId,
      ref:"Video",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref:"Video",
      required: true,
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
      }
  },

  { timestamps: true }
);

export const Comment = mongoose.model("Comment", CommentSchema);

