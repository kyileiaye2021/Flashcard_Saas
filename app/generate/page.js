//in this page, we let user enter text input and generate flashcard texts from open ai api
// then, save the flashcards to Firebase and display them to user
'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])

  //a state for the flashcard set name and dialog open state
  const [ setName, setSetName ] = useState('')
  const [ dialogOpen, setDialogOpen ] = useState(false)

  //functions to handle opening and closing the dialog
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  
  //function to save flashcards to Firebase
  const saveFlashcards = async () => {
      if (!setName.trim()) {
        alert('Please enter a name for your flashcard set.')
        return
      }
    
      try {
        //fetch document for curr user from Firestore using their user.id
        const userDocRef = doc(collection(db, 'users'), user.id)
        const userDocSnap = await getDoc(userDocRef)
  
        const batch = writeBatch(db)
        
        //if user's document already exists, adds the new flashcard set to existing sets
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
          batch.update(userDocRef, { flashcardSets: updatedSets })
        } else { //if the user's document doesn't exist, creates a new document and adds the flashcards
          batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
        }
    
        const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
        batch.set(setDocRef, { flashcards })
    
        await batch.commit() //The batch is committed to Firestore, saving the flashcards.
    
        alert('Flashcards saved successfully!')
        handleCloseDialog()
        setSetName('')
      } catch (error) {
        console.error('Error saving flashcards:', error)
        alert('An error occurred while saving flashcards. Please try again.')
      }
  }

  //handles the form submission for generating flashcards
  const handleSubmit = async () => {
    //check if the input text is empty and shows an alert if it is
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    //sends a POST request to /api/generate endpoint with input text
    try {
      const response = await fetch('/api/generate', {
          method: 'POST',
          body: text,
      })

      if (!response.ok){
          throw new Error('Failed to generate flashcards')
      }
      //if the response is successful, it updates the flashcards state with generated data
      const data = await response.json()
      setFlashcards(data)

    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
        </Box>

        {/*display the generated flashcards*/}
        {/*creates a grid of cards, each representing a flash card with its front and back content */}
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Front:</Typography>
                      <Typography>{flashcard.front}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                      <Typography>{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {flashcards.length > 0 && (

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                  Save Flashcards
                  </Button>
              </Box>

          )}
          {/*dialog component for namiing and saving the flashcard set */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
              <DialogContentText>
              Please enter a name for your flashcard set.
              </DialogContentText>
              <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={saveFlashcards} color="primary">
              Save
              </Button>
          </DialogActions>
          </Dialog>
      </Container>
    )
}