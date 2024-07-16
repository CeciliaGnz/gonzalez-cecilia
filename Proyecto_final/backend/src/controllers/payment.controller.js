import paypal from 'paypal-rest-sdk';
import {
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config.js";

paypal.configure({
  'mode': 'sandbox', // Cambiar a 'live' en producción
  'client_id': PAYPAL_API_CLIENT,
  'client_secret': PAYPAL_API_SECRET
});

// Endpoint para crear el pago
export const createOrder = async (req, res) => {

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": 'http://localhost:3000/html/profileContractor.html?success=true',
      "cancel_url": "http://localhost:3000//html/profileContractor.html?success=false"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Pago de job",
          "sku": "item",
          "price": "15.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "15.00"
      },
      "description": "Pago de trabajo"
    }]
  };
  console.log('aqui')

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      res.status(500).send(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
};
