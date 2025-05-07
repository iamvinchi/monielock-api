import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as inlineCss from 'inline-css';

export const getTemplate = async (template: any, data = {}, opts: any) => {
    const tmData = {
        ...data,
        companyName: "Monielock",
        logoUrl: 'https://res.cloudinary.com/davinchi/image/upload/v1746569606/etv2jqknqhmaujx0mj0h.png',
        btnText: "Get started!",
        unsubscribeUrl: '',
        socialLinks: [
          { name: 'Facebook', url: 'https://web.facebook.com/vincent.chibuike.7169/', icon: 'https://res.cloudinary.com/davinchi/image/upload/v1746570732/uo4gjwxmnh5vfuzhrxkf.png' },
          { name: 'Twitter', url: 'https://x.com/wan2code', icon: 'https://res.cloudinary.com/davinchi/image/upload/v1746570348/xqsbd2jb1ggdcwfyrlgz.png' },
          { name: 'Instagram', url: 'https://www.instagram.com/vincentchibuike92/', icon: 'https://res.cloudinary.com/davinchi/image/upload/v1746570070/mpdzz0ucf3rv8h3unvxr.avif' }
        ]
      }
    const selection: any = {
        welcome: fs.readFileSync(path.join(process.cwd(),'/src/utils/email-template/emails/welcome.ejs' )).toString(),
        resendCode: fs.readFileSync(path.join(process.cwd(),'/src/utils/email-template/emails/resend-code.ejs' )).toString(),
        forgotPassword: fs.readFileSync(path.join(process.cwd(),'/src/utils/email-template/emails/forgot-password.ejs' )).toString(),
        confirmPasswordReset: fs.readFileSync(path.join(process.cwd(),'/src/utils/email-template/emails/password-reset-confirmation.ejs' )).toString()
    };
    const acceptedType = ['welcome', 'resendCode', 'forgotPassword', 'confirmPasswordReset'];
    if (!acceptedType.includes(template))
        throw new Error(`Unknown email template type expected one of ${acceptedType} but got ${template}`)

    const html: any = ejs.compile(selection[template], opts || {},
        { root: path.join(__dirname, 'src') }
    )(tmData);
    return await inlineCss(html, {
        applyStyleTags: false,
        applyTableAttributes: true,
        removeHtmlSelectors: true,
        url: 'http://localhost:3000',
    });
};