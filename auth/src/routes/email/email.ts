// require on top
import express, { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import {
  validateRequest,
  BadRequestError,
  VerificationStatus,
  CodeType,
} from '@vboxdev/common';
import { natsWrapper } from '../../nats-wrapper';
import { CodeCreatedPublisher } from '../../events/publisher/code-created-publisher';
import { Code } from '../../models/code';
import { maskPhoneNumber } from 'mask-phone-number';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID);

export const email = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { telephone } = req.body;

  const existingUser = await User.findOne({ telephone });

  if (!existingUser) {
    throw new BadRequestError('User with telephone number does not exist');
  }

  const verification_code = Math.floor(Math.random() * 899999 + 100000);

  console.log(verification_code);

  client.messages
    .create({
      body: `${verification_code} is your verification code for VBOX`,
      from: '+15209993884',
      to: '+' + telephone,
    })
    //@ts-ignore
    .then((message) => console.log('Phone verification sent to phone'))
    //@ts-ignore
    .catch((error) =>
      console.log(
        'The number  is unverified. Trial accounts cannot send messages to unverified numbers'
      )
    );

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 60 * 5);

  var phone = '+' + existingUser.telephone;

  var maskedPhoneNumber = maskPhoneNumber(phone);

  const user = await Code.findOne({
    $and: [
      { user: existingUser.id },
      { verification: VerificationStatus.Unverified },
    ],
  });

  if (user) {
    // throw new BadRequestError('User already have an unverified initated code');
    user.set({ verification: VerificationStatus.Expire });
    await user.save();
  }

  const code = Code.build({
    user: existingUser.id,
    verification: VerificationStatus.Unverified,
    verification_code: verification_code,
    codeType: CodeType.Verification,
    expiresAt: expiration,
    masked_phone: maskedPhoneNumber,
  });

  new CodeCreatedPublisher(natsWrapper.client).publish({
    expiresAt: code.expiresAt,
    version: code.version,
    verification: code.verification,
    codeType: code.codeType,
    verification_code: code.verification_code,
    masked_phone: code.masked_phone,
    user: code.user,
  });

  await code.save();

  let emailSet;

  if (!existingUser.email) {
    emailSet = 'ayodimejifasina@gmail.com';
  } else {
    emailSet = existingUser.email;
  }

  const emailData = {
    from: 'afasina@nasdng.com',
    to: `${emailSet}`,
    subject: `Dear ${existingUser.username}`,
    html: `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0 auto !important;padding: 0 !important;font-size: 14px;margin-bottom: 10px;line-height: 24px;color: #8094ae;font-weight: 400;height: 100% !important;width: 100% !important;font-family: 'Roboto', sans-serif !important;">
        <head style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
            <meta charset="utf-8" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
            <meta name="viewport" content="width=device-width" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
            <meta name="x-apple-disable-message-reformatting" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
            <title style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;"></title>
    
    
            <body width="100%" style="margin: 0 auto !important;padding: 0 !important;mso-line-height-rule: exactly;background-color: #f5f6fa;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-size: 14px;margin-bottom: 10px;line-height: 24px;color: #8094ae;font-weight: 400;height: 100% !important;width: 100% !important;font-family: 'Roboto', sans-serif !important;">
                <center style="width: 100%;background-color: #f5f6fa;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0 auto !important;padding: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                            <td style="padding: 40px 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                <table style="width: 100%;max-width: 620px;margin: 0 auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
                                    <tbody style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                            <td style="text-align: center;padding-bottom: 25px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                                <a href="#" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;text-decoration: none;"><img style="height: 40px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;-ms-interpolation-mode: bicubic;" src="" alt="logo"></a>
                                                <p style="font-size: 14px;color: #6576ff;padding-top: 12px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">Conceptual Base Modern Dashboard Theme</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table style="width: 100%;max-width: 620px;margin: 0 auto;background-color: #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
                                    <tbody style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                            <td style="padding: 30px 30px 15px 30px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                                <h2 style="font-size: 18px;color: #6576ff;font-weight: 600;margin: 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0;">Confirm Your E-Mail Address</h2>
                                            </td>
                                        </tr>
                                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                            <td style="padding: 0 30px 20px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                                <p style="margin-bottom: 10px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">Hi ${existingUser.username},</p>
                                                <p style="margin-bottom: 10px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">Welcome!
                                                    <br style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                                    You are receiving this email because you have registered on our site.</p>
                                                     <p style="margin-bottom: 10px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                                     Verification Code : ${code.verification_code}
                                                     </p>
                                               
                                            </td>
                                        </tr>
                                    
                                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                            <td style="padding: 20px 30px 40px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                                <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">If you did not make this request, please contact us or ignore this message.</p>
                                                <p style="margin: 0;font-size: 13px;line-height: 22px;color: #9ea8bb;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0;">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at  help@vbox.com</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table style="width: 100%;max-width: 620px;margin: 0 auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;">
                                    <tbody style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                        <tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                            <td style="text-align: center;padding: 25px 20px 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
                                                <p style="font-size: 13px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">Copyright © 20201 VBOX. All rights reserved.
                                                    <br style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">
                                                    Template Made By
                                                    <a style="color: #6576ff;text-decoration: none;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;" href="https://www.vbox.com">VBOX</a>.</p>
                                               
                                                <p style="padding-top: 15px;font-size: 12px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;">This email was sent to you as a registered user of
                                                    <a style="color: #6576ff;text-decoration: none;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;" href="https://www.vbox.com">www.vbox.com</a>. To update your emails preferences
                                                    <a style="color: #6576ff;text-decoration: none;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;margin: 0;padding: 0;" href="#">click here</a>.</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
        </head>
    </html>   
`,
  };
  // @ts-ignore
  sgMail
    .send(emailData)
    // @ts-ignore
    .then((sent) => console.log('SENT 2 >>>'))
    // @ts-ignore
    .catch((err) => console.log('ERR 2 >>>', err));

  next();
};
