import Queue from "../../../../../lib/Queue";
import emailValidator from "../../../../validators/emailValidator";

class RecuperarSenhaController {
  async store(req, res) {
    emailValidator(req.body);

    const { context } = req.body;
    const { user, passwordToken, headerTitle } = context || {};

    if (!(user && passwordToken && headerTitle)) {
      return res.status(401).json({
        message:
          "The properties 'user', 'passwordToken' and 'headerTitle' are required to create the forgotPassword email.",
      });
    }

    await Queue.add("Email", {
      ...req.body,
      template: "forgotPassword",
    });

    return res.json({ succes: true, message: "Email successfully sent." });
  }
}

export default new RecuperarSenhaController();
