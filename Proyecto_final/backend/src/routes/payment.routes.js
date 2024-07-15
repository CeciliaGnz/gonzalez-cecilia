import { Router } from "express";
import {
  createOrder,
  captureOrder,
  cancelPayment,
} from "../controllers/payment.controller.js";

const router = Router();

console.log("Entre a payment routes")

router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelPayment);

export default router;
