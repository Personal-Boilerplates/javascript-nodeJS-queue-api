import { Router } from "express";
import emailRoutes from "./email";
import viewRoutes from "./view";

const routes = Router();

routes.use("/email", emailRoutes);
routes.use("/view", viewRoutes);

export default routes;
