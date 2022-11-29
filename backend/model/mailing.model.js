/* eslint-disable no-console */
/* eslint-disable import/extensions */
import sendgrid from "@sendgrid/mail";
import env from "../utils/env.js";

sendgrid.setApiKey(env.SENDGRID_API_KEY);
const fromEmail = { email: env.SENDGRID_FROM_EMAIL, name: "Kahoot HCMUS" };

async function sendEmail(mailMsg) {
  try {
    if (!env.IS_DEV) {
      await sendgrid.send(mailMsg);
    } else {
      console.log(
        "********************************\n" +
          "Mode: Don't send email in dev environment"
      );
    }
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export default {
  async sendVerifyEmail({ name, email, hours, token }) {
    const verifyLink = `${env.DOMAIN}/mailing/verify-email?token=${token}`;
    const mailMsg = {
      to: email,
      from: fromEmail,
      subject: `Verify your email at Kahoot HCMUS website`,
      templateId: env.SENDGRID_VERIFY_EMAIL_TEMPLATE,
      dynamicTemplateData: {
        name,
        link: verifyLink,
        hours
      }
    };
    await sendEmail(mailMsg);
  },

  async sendGroupInvitationEmail({ groupName, emails, token, groupId }) {
    const invitationLink = `${env.DOMAIN}/group/join?id=${groupId}&token=${token}`;
    const personalization = { to: [], cc: [] };
    for (let i = 0; i < emails.length; i += 1) {
      const email = emails[i];
      if (i !== 0) {
        personalization.cc.push({ email });
      } else {
        personalization.to.push({
          email
        });
      }
    }
    console.log(personalization);
    const mailMsg = {
      personalizations: [personalization],
      from: fromEmail,
      subject: `You have an invitation to join to ${groupName} at Kahoot HCMUS`,
      templateId: env.SENDGRID_GROUP_INVITATION_TEMPLATE,
      dynamic_template_data: {
        link: invitationLink,
        groupName
      }
    };
    if (personalization.to.length !== 0) {
      await sendEmail(mailMsg);
    }
  }
};
