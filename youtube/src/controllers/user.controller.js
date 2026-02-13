import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { jwt } from "jsonwebtoken";


const generateAccessAndRefereshTokens = async(userId) => {
    try{
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateAccessToken()

      user.resfreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return {accessToken, refreshToken}

    } catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

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
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "We think, You're already registered with your email or username.")
    }


    // check for images, check for avatar
    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
                          // ONLINE
    const avatarLocalPath =
    req.files?.avatar?.length > 0
    ? req.files.avatar[0].path
    : null;

    const coverImageLocalPath =
    req.files?.coverImage?.length > 0
    ? req.files.coverImage[0].path
    : null;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
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


const loginUser = asyncHandler(async (req, res) => {
    const {email, usename, password} = req.body

    // if(!(usename && email)) 
    //   OR
    if(!usename && !email){
        throw new ApiError(400, "usename or email is required")
    }

    const user = User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Password Incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    const loggedInUser =  await User.findById(user.id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    User.findById
})

const refreshAccessToken = asyncHandeler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Access Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SCRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
         if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is Used and Expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("newRefreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
 }

