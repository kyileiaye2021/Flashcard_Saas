//For fetching and displaying all of user's saved flashcard sets
//flashcards overview page
'use client'

//fetching and displaying all of the user's saved flashcard sets
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'  // Assuming you're using Clerk for authentication
import { useRouter } from 'next/router'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography
} from '@mui/material'
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'  // Adjust the import path to your Firebase config


export default function Flashcard(){
    //uses Clerk's userUser hook for authentication
    const { isLoaded, isSignedIn, user } = useUser()
    //use React's useStat for managing the flashcards state
    const [ flashcards, setFlashcards ] = useState([])
    //use Next.js's useRouter for navigation
    const router = useRouter()
    

    useEffect(() => { //use a 'useEffect' hook to fetch the user's flashcard sets from Firestore 
        async function  getFlashcards() {
            if (!user) return
            //retrieve the user's document from Firestore 
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            
            //set the flashcard state with the user's flashcard collections
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else { //if the user doesn't exit, create one with empty flashcards array
                await setDoc(docRef, { flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    //when a user clicks on a flashcard set, they are navigated to a detailed view of that set
    //uses Next.js's 'router.push' to navigate to '/flashcard' page with the selected flashcard set's ID as a query parameter
    const handleCardClick = (id) =>{
        router.push(`/flashcard/${id}`)
    }

    //display the flashcard sets
    return ( //renders a grid of cards, each representing a flashcard set
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card> {/*Each card displays the name of the flashcard set and is clickable, leading to detailed view of that set*/}
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
}