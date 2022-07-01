import { Router } from "express";
import * as controller from "./controller";


const testRouter = Router();

testRouter.route("/").get(controller.index);
testRouter.route("/store").post(controller.store);
testRouter.route("/update/:id").put(controller.upsert);
testRouter.route("/delete/:id").delete(controller.destroy);
testRouter.route("/callback").post(controller.callback);

export default testRouter;
