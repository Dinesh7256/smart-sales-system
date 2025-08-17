import sender from '../config/email-config.js'; 

const sendBasicMail = (from, to, mailsubject, mailbody) => {
    return sender.sendMail({
        from: from,
        to: to,
        subject: mailsubject,
        text: mailbody
    });
};

export default sendBasicMail;