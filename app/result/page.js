//for handling the post-payment process and displaying the outcoe to the user
import React from "react"
import { Container, CircularProgress, Typography, Box } from '@mui/material'

const ResultPage = () => {
    //initialize state variables for loading, session data, and potential errors
    const router = useRouter()
    const searchParams = useSearchParams()

    //extract the 'session_id' from the URL paramenters
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    //fetching checkout session 
    useEffect(() => {

        //fetches the checkout session data from API when the component mounts or when the session_id changes
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)

            const sessionData = await res.json()

            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }

          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
      }, [session_id])

      //while the session data is being fetched, a loading indicator is displayed to the user
      if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
      }

      //error handling
      if (error) {
        //If an error occurs during the fetch process, an error message is displayed to the user.
        return (
            <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        )
      }

      //Display final result to the user.
      //If the payment was successful, a thank you message is shown along with the session ID. 
      //if the payment failed, an appropriate message is displayed.
      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          {session.payment_status === 'paid' ? (
            <>
              <Typography variant="h4">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box>
            </>
          )}
        </Container>
      )
}
  