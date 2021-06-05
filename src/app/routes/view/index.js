import { Router } from "express";
import BullBoardView from "./BullBoardView";

const viewRoutes = Router();

viewRoutes.use("/queueBoard", BullBoardView);

export default viewRoutes;
