import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        reqired: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orderItems: {
         type: [orderItemSchema]
    },
    address: {
        types: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Delivered"],
        default: "Pending"
    }
}, {timstamps: true})

export const Order = mongoose.model("Order", orderSchema);