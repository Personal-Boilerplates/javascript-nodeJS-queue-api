import { Router } from "express";
import * as C from "./Controllers";

const emailRoutes = Router();

emailRoutes.post("/recuperarSenha", C.ForgotPassword.store);

export default emailRoutes;
