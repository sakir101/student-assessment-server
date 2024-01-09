import bcrypt from 'bcrypt';
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { sendmail } from '../user/user.util';
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import { isPasswordMatched } from "./auth.utils";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;


    const isUserExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist")
    }

    if (!isUserExist.verifiedUser) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not verified")
    }

    if (
        isUserExist.password &&
        !await isPasswordMatched(password, isUserExist.password)
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
    }


    const { id: userId, role } = isUserExist
    const accessToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string
    )

    const refreshToken = jwtHelpers.createToken(
        { userId, role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    )


    return {
        accessToken,
        refreshToken
    }

}

const renewPassword = async (email: string): Promise<void> => {
    const userData = await prisma.user.findFirst({
        where: {
            email: email
        },
    });

    if (!userData) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist")
    }

    if (!userData.verifiedUser) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User email not verified")
    }
    const charset: string | undefined = config.charset;
    let password = '';

    if (charset) {
        for (let i = 0; i <= 10; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
    }

    const newPassword = await bcrypt.hash(
        password,
        Number(config.bycrypt_salt_rounds)
    )
    const { id } = userData

    const updateUser = {
        password: newPassword
    }

    await prisma.user.update({
        where: {
            id: id
        },
        data: updateUser
    })

    console.log(userData)

    sendmail(email, 'Your new password', `Here is your new password: ${password}`)

    if (!sendmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Request again")
    }

}

export const AuthService = {
    loginUser,
    renewPassword
}