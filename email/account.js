const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeemail = (email, name) => {
    sgMail.send({
        to : email ,
        from:'iec2018046@iiita.ac.in',
        subject:'This is my first email',
        text: `Hello ${name} I hope you are well!!`
    })
} 

const sendCancelemail = (email,name) => { 
    sgMail.send({
        to : email ,
        from:'iec2018046@iiita.ac.in',
        subject:'This is my Cancel email',
        text: `Hello ${name} I hope you are well!!`
    })
}
module.exports = {
    sendWelcomeemail,
    sendCancelemail
}