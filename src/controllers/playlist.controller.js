import { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
// import { Video } from "../models/video.model.js"
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videos } = req.body
    //TODO: create playlist
    if (!(name && description)) {
        throw new ApiError(400, "name nad description required")
    }
    console.log("videos ids", videos);

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
        videos: videos
    })


    // Now populate the videos field in a separate query
    const populatedPlaylist = await Playlist.findById(playlist._id).populate({
        path: 'videos',
        select: 'title thumbnail owner views'
    });

    console.log("playlist create", populatedPlaylist);


    res
        .status(200)
        .json(new Apiresponse(200, populatedPlaylist, "success"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) { throw new ApiError(400, "userid is not found") }

    const playlist = await Playlist.findOne({
        owner: userId,
    })
        .populate({
            "path": "videos",
            "select": "title videos description thumbnail owner views"
        })
    res
        .status(200)
        .json(new Apiresponse(200, playlist, "success"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist id not get")

    const playlist = await Playlist.findById(playlistId).populate({
        path: 'videos',
        select: 'title thumbnail description owner videos views'
    })

    console.log("playlist", playlist);

    res
        .status(200)
        .json(new Apiresponse(200, playlist, "success"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId && videoId)) throw new ApiError(400, "not found playlist id or videoid")

    const playlist = await Playlist.findByIdAndUpdate({
        _id: playlistId,
        $addToSet: { videos: videoId }

    })
    console.log("playlist main video add hogyi kya", playlist);

    res
        .status(200)
        .json(new Apiresponse(200, playlist, "success"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    res
        .status(200)
        .json(new Apiresponse(200, "success"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist id not get")

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    console.log("playlist delete hogyi", playlist);

    res
        .status(200)
        .json(new Apiresponse(200, playlist, "success"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body


    if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist id not get")

    // Now populate the videos field in a separate query
    const playlist = await Playlist.findByIdAndUpdate({
        _id: playlist,
        name,
        description
    })
        .populate({
            path: 'videos',
            select: 'title thumbnail owner views'
        });

    console.log("updatePlaylist ", playlist);

    res
        .status(200)
        .json(new Apiresponse(200, playlist, "success"))
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}