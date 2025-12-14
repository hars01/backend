import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
    },
    coverImage: {
        type: String, //cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is Reqired']
    },
    referenceToken: {
        type: String
    }
},
{timestamps: true}
)

//use of preHook 
//'next' ish liye use ho raha hai ki flag milne me next call kar ke ushko aage pass karde
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next(); //yaha pe hum check karenge ki jo password hai woh madified hua hai ki nahi agar nahi hua rahega toh bina encrypt kiye ushko bahar kardenge
    this.password = bcrypt.hash(this.password, 10) // ishka matlab hai ki ye password ko encrypt karega hash() ke jariye jaha hum jisko hash karna hai woh(this.password) pass karte hai aur jo 10 hai woh round hota hai
    next()
})


//mongoose hume option  deta hai jaha hum method inject kar sakte hai
//(methods) ek object hai jisake help se hum mongoose ke kayi sare mothod(isPassword()) ko add kar sakte hai
//yaha brypt jo hai password ko encrypt bhi kar sakta hai aur check bhi toh yah ye chek kar raha hai
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}



userSchema.methods.generateAccesToken = function(){
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName

    }, 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  ) 
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName

    }, 
    process.env.REFRESH_TOKEN_SCRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  ) 
}



export const User =  mongoose.model("User", userSchema)