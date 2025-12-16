import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {

    // get user detail from req body(frontend)
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);


    // validate the user detail
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "ALL field are required")
    }


    // check if user already exists: username, email
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "We think, You're already registered with your email or username.")
    }


    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
         throw new ApiError(400, "Avatar file is required")
    }


    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
         throw new ApiError(400, "Avatar file is required")
    }


    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    // check for user creation
    if(!createdUser){
         throw new ApiError(500, "Something went wrong while registering the user")
    }

    
    // send response (return res) back to frontend
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});




export { registerUser }