
// import  {isValidObjectId} from "mongoose"
import { User } from "../models/user.model.js"
import  {Subscription}  from "../models/subscription.model.js"
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
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) throw new ApiError(400, "Subscriber ID is required");

  const channels = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username fullname avatar");

  res.status(200).json(
    new Apiresponse(200, channels || [], "Subscribed channels retrieved successfully")
  );
}); 
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) throw new ApiError(400, "Channel ID is required");

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username fullname email avatar");

  res.status(200).json(
    new Apiresponse(200, subscribers || [], "Subscribers retrieved successfully")
  );
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}