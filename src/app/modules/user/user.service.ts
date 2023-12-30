import { Student, User } from "@prisma/client";
import bcrypt from 'bcrypt';
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { mailValidationCheck, sendmail } from "./user.util";

const createStudent = async (studentData: Student, userData: User): Promise<Student | undefined> => {

    if (userData && studentData) {
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
                config.jwt.secret as Secret,
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

            const url = `http://localhost:5000/api/v1/users/${userId}/verify/${token}`;
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

export const UserService = {
    createStudent
}