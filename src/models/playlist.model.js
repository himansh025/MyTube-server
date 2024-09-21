import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// mongooseaggregate is used to plugin
const PlaylistSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
      }]
  },

  { timestamps: true }
);

// CommentSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model("Playlist", PlaylistSchema);
