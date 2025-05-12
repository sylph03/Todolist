import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

// Cấu hình Cloudinary, sử dụng v2 - version 2
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// Function upload file lên Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo một luồng stream upload lên Cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
    // Thực hiện upload luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = {
  streamUpload
}
