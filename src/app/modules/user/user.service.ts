import bcrypt from 'bcrypt';
import { Request } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ICloudinaryResponse, IUploadFile } from "../../../interfaces/file";
import prisma from "../../../shared/prisma";
import { mailValidationCheck, sendmail } from "./user.util";

const createStudent = async (req: Request) => {


    const file = req.file as IUploadFile;


    const { student: studentData, ...userData } = req.body



    if (userData && studentData) {
        if (file === undefined) {
            studentData.profileImage = 'https://res.cloudinary.com/dporza1qj/image/upload/v1707104604/profile_sllerv.png'
        }

        else {
            const uploadImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(file)

            if (uploadImage) {
                studentData.profileImage = uploadImage.secure_url
            }
        }




        const res = mailValidationCheck(userData.email, studentData.institution)

        if (!res) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Mail is invalid')
        }

        userData.verifiedUser = false
        userData.role = 'student'
        userData.password = await bcrypt.hash(
            userData.password,
            Number(config.bycrypt_salt_rounds)
        )

        const newUser = await prisma.$transaction(async (transactionClient) => {
            const userResult = await transactionClient.user.create({
                data: userData
            })

            if (!userResult) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
            }

            studentData.userId = userResult.id
            const studentResult = await transactionClient.student.create({
                data: studentData
            })

            if (!studentResult) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
            }

            const updateUser = {
                studentId: studentData.studentId
            }

            await transactionClient.user.update({
                where: {
                    id: userResult.id
                },
                data: updateUser
            })

            const { id: userId, role, email } = userResult
            const token = jwtHelpers.createToken(
                { userId, role },
                config.jwt.student_secret as Secret,
                config.jwt.expires_in as string
            )

            if (!token) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'User signup failed!')
            }


            const tokenResult = await transactionClient.token.create({
                data: {
                    userId,
                    token
                }
            });

            if (!tokenResult) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'User signup failed!')
            }

            const url = `<p>Please click here <a href="http://localhost:5000/api/v1/users/${userId}/verify/${token}">Link</a> to verify your email</p>`;
            sendmail(email, 'verify email', url)
            if (!sendmail) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Request again")
            }

            return studentResult

        })

        if (!newUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
        }

        return newUser

    }



}


const createFaculty = async (req: Request) => {


    const file = req.file as IUploadFile;


    const { faculty: facultyData, ...userData } = req.body



    if (userData && facultyData) {
        if (file === undefined) {
            facultyData.profileImage = 'https://res.cloudinary.com/dporza1qj/image/upload/v1707104604/profile_sllerv.png'
        }

        else {
            const uploadImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(file)

            if (uploadImage) {
                facultyData.profileImage = uploadImage.secure_url
            }
        }


        userData.verifiedUser = false
        userData.role = 'faculty'
        userData.password = await bcrypt.hash(
            userData.password,
            Number(config.bycrypt_salt_rounds)
        )

        const newUser = await prisma.$transaction(async (transactionClient) => {
            const userResult = await transactionClient.user.create({
                data: userData
            })

            if (!userResult) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
            }

            facultyData.userId = userResult.id
            const facultyResult = await transactionClient.faculty.create({
                data: facultyData
            })

            if (!facultyResult) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
            }

            const updateUser = {
                facultyId: facultyData.facultyId
            }

            await transactionClient.user.update({
                where: {
                    id: userResult.id
                },
                data: updateUser
            })

            return facultyResult

        })

        if (!newUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
        }

        return newUser

    }



}




export const UserService = {
    createStudent,
    createFaculty
}