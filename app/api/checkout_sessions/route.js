// This will handle our Stripe checkout process

import { NextResponse } from "next/server"; //used to send HTTP responses from API routes
import Stripe from "stripe";

//utility function
// converts an amount (in dollars) to the format required by stripe
const formatAmountForStripe = (amount, currency) => {
    return Math.round(amount * 100)
}

//initializing stripe api
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
})

//handles POST requests sent to the API route
// also main func where checkout session is created
export async function POST(req) {
    try {
        
        //parameters for the Checkout Session
        const params = {
            mode: 'subscription', //set to handle subscriptions
            payment_method_types: ['card'], //specify that only card payments are accepted
            line_items: [ //contains the details of the product or service being purchased
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro subscription', //name of the product
                        },
                        unit_amount: formatAmountForStripe(10, 'usd'), //$ 10.00 in cents
                        recurring: { // specifies that the product is a subscription with a monthly
                            interval: 'month',
                            interval_count: 1,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get( //redirect the user to after a successful payment
                'Referer',
            )}result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get( // redirect the user to if they cancel the payment
                'Referer',
            )}result?session_id={CHECKOUT_SESSION_ID}`,
        }

        //create the checkout session by calling Stripe API 
        const checkoutSession = await stripe.checkout.sessions.create(params)

        //created checkout session is returned as a JSON response with a 200 status code, indicating success
        return NextResponse.json(checkoutSession, {
            status: 200,
        })

    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
            status: 500,
        })
    }
}


//for retrieveing details of a Stripe checkout session using a session ID
export async function GET(req) {
    //extracts the query parameters from the request URL
    const searchParams = req.nextUrl.searchParams

    //retrieve the val of session_id from query parameter of the request
    const session_id = searchParams.get('session_id')

    try {
        //if no session_id is provided, it throws an error
        if (!session_id) {
            throw new Error('Session ID is required')
        }

        //use Stripe API to retrieve the checkout session details
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
        
        //return the session details as JSON response
        return NextResponse.json(checkoutSession)

    } catch (error) {
        console.error('Error retrieving checkout session:', error)
        return NextResponse.json({ error: {message: error.message }}, { status: 500 })
    }
}