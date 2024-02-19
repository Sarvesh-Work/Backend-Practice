import { asyncHandler } from "../utils/asycHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.models.js";
import { UplodeOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, email, userName, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required ");
  }

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) {
    throw ApiError(400, "avatar file required");
  }

  const avatar = await UplodeOnCloudinary(avatarLocalPath);
  const coverImage = await UplodeOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw ApiError(400, "avatar file required");
  }

  const user=await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowercase(),
  });

  const createdUser= await user.findById(user_id).select(
   "-password -refreshToken"
  )


  if (!createdUser) {
   throw new ApiError(500, "something went wrong")
   
  }

   return res.status(201).json(
      new ApiResponse(200,createdUser,"user register Successfully")
   )
  

});

export { registerUser };
