import { mailtrapClient, sender } from "./mailtrap.config.js";
import {EMAIL_TEMPLATE} from "./emailTemplates.js";

export const sendSuccessEmail = async (email) => {
    console.log("Sending Email to" , email);
   

    try {
        const response = await mailtrapClient.sendMail({
            from:sender,
            to:email,
            subject: "Order Successful",
            html: EMAIL_TEMPLATE,
            category: "Successful order"
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending Email", error);
        throw new error(`Error sending Email,${error.message}`);
    }
}