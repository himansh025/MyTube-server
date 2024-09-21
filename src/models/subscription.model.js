import{ mongoose, Schema} from 'mongoose'

const SubscriptionModel= new Schema({
subscriber:{
    type: Schema.Types.ObjectId,
    // who is subscriber
    ref:'User'
},
channel:{
    type: Schema.Types.ObjectId,
    // onw whom to subscribing
    ref:'User'
}
},{timestamps: true})

export const Subscription = mongoose.model("Subscription",SubscriptionModel) 