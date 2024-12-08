import  {isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/Apierror.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { uploadOnCloudinary } from "../utils/cloudniary.js"
import { Apiresponse } from "../utils/Apiresponse.js"

const getAllVideos = asyncHandler(async (req, res) => {
  let { page, limit, query, sortBy, sortType, userId, filterByUser, random } = req.query;

  // Set defaults for pagination if not provided
  page = page ? parseInt(page) : 1;
  limit = limit ? parseInt(limit) : 10;

  const filter = {};

  // Search videos by title or description if query is provided
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ];
  }

  // Filter by userId if provided, valid, and filterByUser is true
  if (filterByUser === "true" && userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  try {
    let videos;
    const totalVideos = await Video.countDocuments(filter);

    if (random === "true") {
      // Fetch random videos
      videos = await Video.aggregate([
        { $match: filter },
        { $sample: { size: limit } },
      ]);
    } else {
      // Apply sorting if specified
      const sortOptions = {};
      if (sortBy && sortType) {
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
      }

      // Fetch videos with applied filters, sort, and pagination
      videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);
    }

    res.status(200).json(new Apiresponse(200, {
      user: filterByUser === "true" ? userId : null,
      docs: videos,
      total: totalVideos,
      page,
      limit,
      totalPages: Math.ceil(totalVideos / limit),
    }, "Fetched videos successfully"));
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    console.log("files",req.files);
    // console.log(req.user._id);
    
    const { title, description } = req.body
    if (!(title && description)) {
        throw new ApiError(500, "title and description is req")
    }
console.log(title,description,"agaya");

    let videofile, videothumbnail;

    if (!(req.files.thumbnail )) {
        throw new ApiError(500, "video and thumbnail are req to upload")
    }

    if (req.files?.thumbnail && req.files.videofile) {
        videothumbnail = req.files?.thumbnail[0].path;
        console.log("upload videothumbnail path", videothumbnail);
    }

    if (req.files?.videofile) {
        videofile = req.files?.videofile[0].path;
        console.log("upload vidoe path", videofile);
    }

    const thumbnails =await uploadOnCloudinary(videothumbnail)
    console.log("upload videothumbnail url from clodinary", thumbnails);

    const videos =await uploadOnCloudinary(videofile)
    console.log("upload videoUrl url from clodinary", videos);

    
    const owner = await User.findById(req.user?._id);
    if(!owner){
        throw new ApiError(400 , "User authentication is required");
    }

    console.log("owner  vd",owner);
    

    const video = await Video.create({
        title,
        description,
        videofile: videos.url,
        thumbnail: thumbnails.url,
        views:0,
        owner: owner._id,
        duration:videos.duration
       
    })
    console.log("video created",video);
    
 video.save()
 console.log('video document',video);
 
    res
    .status(200)
    .json(new Apiresponse( 200,video," add"))
    


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // console.log("videoid for 1 v in backend",videoId);
    
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(500, "invalid video id")
    }
    const video = await Video.findById(videoId)
    // console.log("video aagyi", video);

    if (!video) {
        throw new ApiError(500, "video not found by id")
    }
    res
        .status(200)
        .json(new Apiresponse(200, video, "video get successfully by id"))

})
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(500, "Invalid video ID");
  }

  const { title, description } = req.body;
  console.log('Video ID:', videoId);

  let videofilepath = req.body?.data.videofile;
  let thumbnailpath = req.body?.data.thumbnail;

  // Validation for video file and thumbnail
  if (!videofilepath) throw new ApiError(400, "Video path not found");
  if (!thumbnailpath) throw new ApiError(400, "Thumbnail path not found");

  try {
    // Upload video and thumbnail to Cloudinary
    const updatevideolink = await uploadOnCloudinary(videofilepath);
    const updatethumbnaillink = await uploadOnCloudinary(thumbnailpath);

    console.log("Video link:", updatevideolink);
    console.log("Thumbnail link:", updatethumbnaillink);

    if (!(title || description)) throw new ApiError(400, "Title and description are required for update");

    // Update video data in the database
    const video = await Video.findByIdAndUpdate(
      videoId, {
        title: req.body.title,
        description: req.body.description,
        thumbnail: updatethumbnaillink,
        videofile: updatevideolink,
      }
    );

    console.log("Updated video:", video);

    res.status(200).json(new Apiresponse(200, video, "Video updated successfully"));
  } catch (error) {
    console.error("Error during video update:", error);
    res.status(500).json({ error: error.message });
  }
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Logging the video ID to be deleted
    console.log("video id", id);
  
    // Step 1: Validate the ObjectId format
    if (!isValidObjectId(id)) {
      throw new ApiError(400, "video id not found");
     }
  
    // Step 2: Attempt to find and delete the video by ID
    // const videosearch  =await Video.findById(videoId)
    // console.log("videoid search",videosearch);
    
    const video = await Video.findByIdAndDelete(id);
    
    // Logging the result of the deletion operation
    console.log("video delete", video);
  
    // Step 3: Handle the case where the video was not found
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    // Step 4: Respond with success if the video was deleted
    res.status(200).json(new Apiresponse(200, video, "Video deleted successfully"));
  });
  

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    res
.status(200)
json(new Apiresponse( 200," updated"))

})
const incrementView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  console.log("Video to increment views:", video);

  // Increment the views
  video.views += 1;

  try {
    // Save the updated video
    const updatedVideo = await video.save();
    // console.log("After saving:", updatedVideo);

    return res.status(200).json(
      new Apiresponse(
        200,
        updatedVideo,
        "View incremented successfully"
      )
    );
  } catch (error) {
    console.error("Error saving video:", error);
    throw new ApiError(500, "Failed to increment views");
  }
});



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementView
}