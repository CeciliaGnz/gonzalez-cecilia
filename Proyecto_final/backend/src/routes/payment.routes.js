import { Router } from "express";
import {
  createOrder,

} from "../controllers/payment.controller.js";

const router = Router();

console.log("Entre a payment routes")

router.post("/create-order", createOrder);


export default router;
