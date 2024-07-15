import { config } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv
config({ path: path.resolve(__dirname, '../.env') });

// Paypal
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
export const PAYPAL_API = process.env.PAYPAL_API; // url sandbox or live for your app

console.log("PAYPAL_API_CLIENT: ", PAYPAL_API_CLIENT);
console.log("PAYPAL_API_SECRET: ", PAYPAL_API_SECRET);
console.log("PAYPAL_API: ", PAYPAL_API);

// Server
export const PORT = process.env.PORT || 4000;
console.log("PORT IN CONFIG: ", PORT);
export const HOST =
  process.env.NODE_ENV === "production"
    ? process.env.HOST
    : "http://localhost:" + PORT;
    console.log("entre a envhost ", PORT);
