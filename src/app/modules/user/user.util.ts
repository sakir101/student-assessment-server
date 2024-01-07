import nodemailer from 'nodemailer';
import config from '../../../config';

export const sendmail = async (email: string, subject: string, text: string): Promise<void> => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email,
            pass: config.email_password
        },
        tls: {
            rejectUnauthorized: false
        }
    })



    const mailOptions = {
        from: config.email,
        to: email,
        subject: subject,
        html: text,
    }

    //3. send email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Eamil sent successfully')
    } catch (error) {
        console.log('Email send failed with error:', error)
    }
}

export const mailValidationCheck = (email: string, institution: string) => {

    const domainPatternDIU = /@diu\.edu\.bd$/i;

    const isValidEmailDIU = domainPatternDIU.test(email);

    if (isValidEmailDIU && institution == "Daffodil International University") {
        return true
    } else {
        return false
    }
}

