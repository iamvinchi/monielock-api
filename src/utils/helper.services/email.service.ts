import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from "nodemailer"

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

async sendMail(to: string[], subject: string, message: string) {
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: this.configService.get("GMAIL_APP_USERNAME"),
            pass: this.configService.get("GMAIL_APP_PASS")
        },
        tls: {
            rejectUnauthorized:false
        }
    });

    transporter.sendMail(
        {
            from: 'monielock@gmail.com',
            to,
            subject,
            html: message,
        },
        (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        },
    );
}
}
