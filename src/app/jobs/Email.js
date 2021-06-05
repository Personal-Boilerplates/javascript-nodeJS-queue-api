import Mail from "../../lib/Mail";

// Every Job must be a object with the properties key as string and handle as function.

export default {
  key: "Email",
  options: {
    attempts: 5,
    removeOnComplete: true,
  },
  async handle({ data }) {
    await Mail.sendMail(data);
  },
};
