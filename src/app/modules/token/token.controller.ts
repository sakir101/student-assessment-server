import express, { Request, Response } from "express";
import path from 'path';
import catchAsync from "../../../shared/catchAsync";
import { TokenService } from "./token.service";

const app = express();

const verifyEmail = catchAsync(async (req: Request, res: Response) => {


    await TokenService.verifyEmail(req.params.userId, req.params.token)

    app.use(express.static(path.join(__dirname, 'public')));
    // Read the HTML file
    const filePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(filePath);


})

export const TokenController = {
    verifyEmail
}