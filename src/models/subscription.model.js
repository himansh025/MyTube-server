import mongoose,{ Schema, schema} from 'mongoose'

const SubsreiptionModel= new schema({
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

export const SUBSCRIPTION = mongoose.model("subscription",SubsreiptionModel) 