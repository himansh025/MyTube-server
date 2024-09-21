// import { compare } from "bcrypt";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createTweet = asyncHandler(async (req, res) => {
    // const {videoid}=req.params;
    const { content } = req.body

    const user = await User.findById(req.user?.id);

    console.log("content", req.body);

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    if (!user) {
        throw new ApiError(400, "something wrongs")
    }
    const tweet = await Tweet.create({ owner: user?._id, content })
    console.log("tweet", tweet);

    res.
        status(200)
        .json(new Apiresponse(200, tweet, "tweet successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // if (!id) { throw new ApiError(400, "tweetid not found") }
    const tweet = await Tweet.find()
    console.log("all tweet", tweet);

      if (!tweet) { throw new ApiError(400, "tweet not found") }

    res.
        status(200)
        .json(new Apiresponse(200, tweet, "tweet delete success"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content } = req.body;
    console.log("update",content);
    
    const { id } = req.params;
    const userid = req.user?._id
    if (!content) { throw new ApiError(400, "content is req") }

    if (!userid) { throw new ApiError(400, "userid not found") }
    const tweet = await Tweet.findByIdAndUpdate(
        id, {
        content: content
    }
    )
    console.log("tweet update", tweet);

    res.
        status(200)
        .json(new Apiresponse(200, tweet, "tweet update successfully"))

})



const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { id } = req.params;


    if (!id) { throw new ApiError(400, "tweetid not found") }
    const tweet = await Tweet.findByIdAndDelete(id)
    console.log("tweet delte", tweet);

    res.
        status(200)
        .json(new Apiresponse(200, tweet, "tweet delete success"))
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}