import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
// gs is file syastem default by nodejs  help to red,write,delete ,async,open



    // Configuration
    // cloudinary.config({ 
    //     cloud_name: process.env.CLOUDNIARY_CLOUD_NAME, 
    //     api_key: process.env.CLOUDNIARY_API_KEY, 
    //     api_secret: process.env.CLOUDNIARY_API_SECRET 
    //     // Click 'View Credentials' below to copy your API secret
    // });
    

    cloudinary.config({ 
        cloud_name: 'draezw4ed', 
        api_key: '111157882142936', 
        api_secret:
        'IHHjYTk9TSAhCES60FFYkwSRVyE' , 
        // Click 'View Credentials' below to copy your API secret
    });
    


const uploadOnCloudinary= async (localFilePath)=>{
try {
    console.log('localpath agya',localFilePath);
    if(!localFilePath) return null
    // upload the file on cloudinary
 const response=  await cloudinary.uploader.upload(localFilePath,{
    resource_type:"auto"
})
// console.log("response images",response);

// file has been uploaded succesfully    
console.log("file is uploaded on clodinary",response.url);
fs.unlinkSync(localFilePath)
return response;

} catch (error) {
    // unlink the file by syncronous way 
    // remove the locally saved tem file as the upload operaton got failed
    if(localFilePath){
        fs.unlinkSync(localFilePath)
    }
    return null;
}

 }

 export {uploadOnCloudinary}











//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();