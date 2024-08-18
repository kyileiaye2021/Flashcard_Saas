//utility function
import { loadStripe } from '@stripe/stripe-js'

//declared outside the func so it can be reused across diff calls to getStripe()
let stripePromise //to store the promise returned by loadstripe

//ensures that we only create one instance of Stripe, reusing it if it already exists.
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    }
    return stripePromise
}

export default getStripe