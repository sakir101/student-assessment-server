import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import multer from 'multer';
import { ICloudinaryResponse, IUploadFile } from '../interfaces/file';

cloudinary.config({
    cloud_name: 'dporza1qj',
    api_key: '285161419482345',
    api_secret: 'jPji9nEXgYL44xO5W5qOYwR54WA'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path);
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
}

export const FileUploadHelper = {
    uploadToCloudinary,
    upload
}

