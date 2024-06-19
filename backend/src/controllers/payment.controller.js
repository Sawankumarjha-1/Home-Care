import { asyncHandler } from "../utils/asynchandler.util.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIP_SECRET_KEY);

export const payment = asyncHandler(async (req, res) => {
  const { storage, token } = req.body;
  // console.log(storage);
  // console.log(token);
  const idempotencyKey = uuid();
  // console.log(storage, token);
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: parseFloat(storage.amount) * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: "Payment Successfull !",
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

export const paymentStatus = asyncHandler(async (req, res) => {});
