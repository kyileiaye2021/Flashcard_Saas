import { NextResponse } from "next/server";
import OpenAI  from "openai";

//defining system prompt
const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
    "flashcards": [
        {
            "front": "Front of the card",
            "back": "Back of the card"
        }
    ]
}
`
//creates a new OpenAI client instance and extracts the text data fro the req body
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text() //extracts text data from the request body

    //implement the Open AI API call 
    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt},
            { role: 'user', content: data},
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object'},//set the response_format to json obj to ensure we receive a JSON response
    })

    //process API response 
    //parse the JSON content from the OpenAI API response
    const flashcard = JSON.parse(completion.choices[0].message.content)

    //return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
}