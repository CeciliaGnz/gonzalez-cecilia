import { Router } from "express";
import { createOrder, executePayment } from "../controllers/payment.controller.js";

const router = Router();

console.log("Entre a payment routes");

router.post("/create-order", createOrder);
router.get("/execute-payment", executePayment);

export default router;
