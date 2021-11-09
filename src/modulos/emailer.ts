import * as nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: process.env.NM_EMAIL,
//         pass: process.env.NM_PASS
//     }
// });

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NM_EMAIL,
        pass: process.env.NM_PASS
    }
});
if(process.env.NM_ACT == 'true'){
    transporter.verify().then(() => {
        console.log('Listo para enviar emails');
    })
}

export default transporter;