import express, { Response } from 'express';
import path from 'path';

const app = express();

const emailVerifyRoute = (res: Response) => {
    app.use(express.static(path.join(__dirname, 'public')));
    // Read the HTML file
    const filePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(filePath);


}

export const EmailVerificationController = {
    emailVerifyRoute
}