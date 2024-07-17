import paypal from 'paypal-rest-sdk';
import { PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from "../config.js";

paypal.configure({
  'mode': 'sandbox', 
  'client_id': PAYPAL_API_CLIENT,
  'client_secret': PAYPAL_API_SECRET
});
 
export const createOrder = async (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": 'http://localhost:3000/api/payments/execute-payment',
      "cancel_url": "http://localhost:3000/html/profileContractor.html?success=false"
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

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      res.status(500).send(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          // Almacenar datos en la sesión
          req.session.pendingJobData = req.body.jobData;
          req.session.token = req.body.token;

          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
};

export const executePayment = async (req, res) => {
  const { PayerID, paymentId } = req.query;

  const execute_payment_json = {
    "payer_id": PayerID,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "15.00"
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
    if (error) {
      console.log(error.response);
      res.redirect('http://localhost:3000/html/profileContractor.html?success=false');
    } else {
      const jobData = req.session.pendingJobData;
      const token = req.session.token;

      try {
        const jobResponse = await fetch('http://localhost:3000/api/jobs/createJob', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jobData)
        });

        if (!jobResponse.ok) {
          throw new Error('Error creando el trabajo');
        }

        req.session.pendingJobData = null;
        req.session.token = null;

        res.redirect('http://localhost:3000/html/profileContractor.html?success=true');
      } catch (error) {
        console.error('Error:', error);
        res.redirect('http://localhost:3000/html/profileContractor.html?success=false');
      }
    }
  });
};
