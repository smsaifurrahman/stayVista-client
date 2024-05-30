/** @format */

// This example shows you how to set up React Stripe.js and use Elements.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import "./CheckoutForm.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CheckoutForm = ({ closeModal, bookingInfo,refetch }) => {
   const { user } = useAuth();
   const stripe = useStripe();
   const elements = useElements();
   const axiosSecure = useAxiosSecure();
   const [clientSecret, setClientSecret] = useState();
   const [cardError, setCardError] = useState("");
   const [processing, setProcessing] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      // fetch client secret
      if (bookingInfo?.price && bookingInfo?.price > 1) {
         getClientSecret({ price: bookingInfo.price });
      }
   }, [bookingInfo?.price]);

   // get client secret
   const getClientSecret = async (price) => {
      const { data } = await axiosSecure.post(`/create-payment-intent`, price);
      //  return data
      console.log("client secret from server", data);
      setClientSecret(data.clientSecret);
   };

   const handleSubmit = async (event) => {
      // Block native form submission.
      event.preventDefault();
      setProcessing(true);

      if (!stripe || !elements) {
         // Stripe.js has not loaded yet. Make sure to disable
         // form submission until Stripe.js has loaded.
         return;
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const card = elements.getElement(CardElement);

      if (card == null) {
         return;
      }

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: "card",
         card,
      });

      if (error) {
         console.log("[error]", error);
         setCardError(error.message);
         setProcessing(false);
         return;
      } else {
         console.log("[PaymentMethod]", paymentMethod);
         setCardError("");
      }

      // confirm payment

      const { error: confirmError, paymentIntent } =
         await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
               card: card,
               billing_details: {
                  email: user?.email,
                  name: user?.displayName,
               },
            },
         });
      if (confirmError) {
         console.log(confirmError);
         setCardError(confirmError.message);
         setProcessing(false);
         return;
      }

      if (paymentIntent.status === "succeeded") {
        //  console.log(paymentIntent);
         // 1. Create payment info object
         const paymentInfo = {
            ...bookingInfo,
            roomId: bookingInfo._id,
            transactionId: paymentIntent.id,
            date: new Date(),
         };

         delete paymentInfo._id;
        //  console.log(paymentInfo);
         try {
            // 2. save payment info in booking collection in db
          const {data} =  await axiosSecure.post('/booking',paymentInfo);

             // 3. change room status to booked in db
          await axiosSecure.patch(`/room/status/${bookingInfo?._id}`,{status: true});
          console.log(data);
          
            //update UI
            refetch();
            closeModal();
            toast.success("Room is booked successfully")
            navigate('/dashboard/my-bookings')
         } catch (err) {
            console.log(err);
         }

         setProcessing(false);
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit}>
            <CardElement
               options={{
                  style: {
                     base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                           color: "#aab7c4",
                        },
                     },
                     invalid: {
                        color: "#9e2146",
                     },
                  },
               }}
            />

            <div className="flex mt-2 justify-around">
               <button
                  disabled={!stripe || !clientSecret || processing}
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
               >
                  {processing ? (
                     <ImSpinner9
                        size={24}
                        className="animate-spin  m-auto mr-2"
                     ></ImSpinner9>
                  ) : (
                     ` Pay $${bookingInfo?.price}`
                  )}
               </button>
               <button
                  onClick={closeModal}
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
               >
                  Cancel
               </button>
            </div>
         </form>
         {cardError && (
            <p className="text-red-500 text-center"> {cardError} </p>
         )}
      </>
   );
};

CheckoutForm.propTypes = {
   bookingInfo: PropTypes.object,
   closeModal: PropTypes.func,
   refetch: PropTypes.func
};
export default CheckoutForm;