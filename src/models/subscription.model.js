import mongoose, { Schema } from 'mongoose';

const SubscriptionModel = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    // who is subscribing
    ref: 'User',
  },
  channel: {
    type: Schema.Types.ObjectId,
    // whom they are subscribing to
    ref: 'User',
  },
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", SubscriptionModel);


