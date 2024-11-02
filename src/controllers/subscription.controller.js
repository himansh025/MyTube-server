
// import  {isValidObjectId} from "mongoose"
import { User } from "../models/user.model.js"
import  Subscription  from "../models/Subscription.model.js"
import { ApiError } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle Subscription
    if(!channelId){
        throw new ApiError(400 , "Channel id is required");
    }
    console.log("channelid backend",channelId);    
  // Find the channel by ID
const Channel = await User.findById(channelId)
console.log("channel",Channel);
if (!Channel) {
    throw new ApiError(404, "Channel not found");
  }


// const subscribed= await User.findById({
//     _id: req.user?._id,
//     Channel:Channel._id
// })

 // Check if the user is already subscribed
 const existingSubscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: Channel._id,
  });

console.log("existing user",existingSubscription);

let subscriber;
if(existingSubscription==null){
subscriber = await Subscription.create({
    subscriber: req.user?._id,
    channel: Channel._id  
})
}
else{
    subscriber = await Subscription.findOneAndDelete({
        subscriber: req.user?._id,
        channel: Channel._id  
    })}

    console.log("after all the method subscriber",subscriber);
    
// if(!user){
//     throw new ApiError(400 , "user not found");
// }
res
.status(200)
.json( new Apiresponse( 200,subscriber,"succesfull"))
})

// controller to return subscriber list of a channel

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate if channelId is provided
  if (!channelId) throw new ApiError(400, "Channel ID is required");

  // Find subscribers for the given channel ID

  const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username fullname email avatar');

  console.log("Subscribers list:", subscribers);
  console.log("Number of subscribers:", subscribers.length);

  // If no subscribers found, handle accordingly
  if (subscribers.length === 0) {
    return res.status(200).json(new Apiresponse(200, [], "No subscribers found"));
  }

  // Return the list of subscribers
  res.status(200).json(new Apiresponse(200, subscribers, "Subscribers retrieved successfully"));
});

// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params; // subscriberId is the user's ID
    console.log("susbscriber id",subscriberId);
    
    // Validate that a user ID (subscriberId) is provided
    if (!subscriberId) throw new ApiError(400, "User ID is required");
    
  
    // Find all subscriptions where the user (subscriber) has subscribed to channels
    const channels = await Subscription.find({ 
      subscriber: subscriberId // Filtering by user ID
    }).populate('channel', 'name username'); // Populate channel details with name and username
    
    // If no channels are found, throw an error
    if (!channels.length) throw new ApiError(404, "Channels not found");
  
    console.log("Number of subscribed channels:", channels.length);
    console.log("Subscribed channels:", channels);
  
    // Send a response with the list of channels the user is subscribed to
    res.status(200).json(new Apiresponse(200, channels, "Successful"));
  });
  
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}