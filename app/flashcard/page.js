//handle the detailed view of a specific flashcard set.
// allows users to study and interact with the flashcards within a particular set, such as flipping cards to see the answer on the back.

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'  // Assuming you're using Clerk for authentication
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography
} from '@mui/material'
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'  // Adjust the import path to your Firebase config
import { useSearchParams } from 'next/navigation'

export default function Flashcard() {
    //uses Clerk's userUser hook for authentication
    const { isLoaded, isSignedIn, user } = useUser()

    //use React's useState for managing the flashcards and their flip states
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    
    //Next.js’s `useSearchParams` to get the flashcard set ID from the URL
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
  
    //fetch the specific flashcard set when the component mounts or when the user or search parameter changes
    useEffect(() => {
        async function getFlashcards() {
            if (!search || !user) return

            //retrieves all flashcards in the specified set from Firestore 
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDoc(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards) //updates the `flashcards` state
        }
        getFlashcards()
    }, [search, user])

    // handle flipping flashcards
    const handleCardClick = (id) => {
        //toggles the flip state of a flashcard when it’s clicked
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }

      //renders a grid of flashcards, each with a flipping animation
      //Each flashcard is displayed as a card that flips when clicked, revealing the back of the card. The flip animation is achieved using CSS transforms and transitions.
      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box sx={{ /* Styling for flip animation */ }}>
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
  }
  