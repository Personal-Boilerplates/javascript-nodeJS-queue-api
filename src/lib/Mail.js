import nodemailer from "nodemailer";
import exphbs from "express-handlebars";
import path from "path";
import nodemailerhbs from "nodemailer-express-handlebars";
import mailConfig from "../config/mail.js";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = path.resolve("src", "app", "views", "emails");

    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: path.resolve(viewPath, "layouts"),
          partialsDir: path.resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs",
        }),
        viewPath,
        extName: ".hbs",
      })
    );
  }

  /**
   * @param {import("nodemailer").SendMailOptions} message
   */
  sendMail(message) {
    const { attachments = [] } = message || {};

    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
      attachments: [
        ...attachments,
        {
          filename: "facebook.svg",
          path: "./src/assets/logos/facebook.svg",
          cid: "faceBookLogo",
        },
        {
          filename: "instagram.svg",
          path: "./src/assets/logos/instagram.svg",
          cid: "instagramLogo",
        },
      ],
    });
  }
}

export default new Mail();
