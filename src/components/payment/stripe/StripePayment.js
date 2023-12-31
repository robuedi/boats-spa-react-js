import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import Payment from "./../../../services/Payment"

function StripePayment(props) {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [intentId, setIntentId] = useState("");
    const [email, setEmail] = useState('');

    useEffect(() => {
        setStripePromise(loadStripe(`${process.env.REACT_APP_REACT_PK}`))
    }, []);

    const getIntent = () => {
        Payment.initiatePayment(props.productId, email)
        .then((result) => {
            setClientSecret(result.data.client_secret);
            setIntentId(result.data.intent_id)
        });
    }


    return (
        <>
            <h4>Payment</h4>
            <br/>
            {!(email && clientSecret && stripePromise) ? (
                <div>
                    <div className="col-auto">
                        <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Please enter your email to proceed with payment" />
                    </div>
                    <br/>
                    <button className="btn btn-primary" onClick={e => getIntent()}>Continue</button>
                </div>
            )
                :
                (
                    <Elements
                        stripe={stripePromise}
                        options={{ clientSecret, locale: "uk" }}
                    >
                        <StripeCheckoutForm intentId={intentId} />
                    </Elements>
                )
            }
        </>
    );
}

export default StripePayment;