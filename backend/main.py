from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import uuid
import random
import requests

app = FastAPI()
WORD_LENGTH = 5

# Session model
class Session(BaseModel):
    id: str
    word: str
    current_guess: str
    tries: int = 0
    status: str = "ongoing"


# Request model for the guess endpoint
class GuessRequest(BaseModel):
    session_id: str
    letter: str

sessions = {}

# Load words with length=WORD_LENGTH from an open dictionary API
def load_words():
    words_url = f"https://random-word-api.herokuapp.com/word?length={WORD_LENGTH}&number=1000"
    response = requests.get(words_url)
    return response.json()

word_list = load_words()

# Create a new session
@app.post("/create_session")
def create_session():
    if not word_list:
        raise HTTPException(status_code=500, detail="No words available")
    word = random.choice(word_list)
    session_id = str(uuid.uuid4())
    sessions[session_id] = Session(id=session_id, word=word, current_guess="_" * len(word))
    return {"session_id": session_id, "current_guess": sessions[session_id].current_guess}

@app.get("/word_list")
def get_word_list():
    return word_list


@app.get("/session/{session_id}/word")
def get_session_word(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"word": sessions[session_id].word}


# Create a new session
@app.post("/create_session")
def create_session():
    word = random.choice(word_list)
    session_id = str(uuid.uuid4())
    sessions[session_id] = Session(id=session_id, word=word, current_guess="_" * len(word))
    return {"session_id": session_id, "current_guess": sessions[session_id].current_guess}


# Guess a letter
@app.post("/guess")
def guess(request: GuessRequest = Body(...)):
    session_id = request.session_id
    letter = request.letter

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    session = sessions[session_id]
    if session.tries >= 6:
        raise HTTPException(status_code=400, detail="Maximum number of tries reached")
    word = session.word
    current_guess = list(session.current_guess)
    correct = False
    for i, char in enumerate(word):
        if char == letter:
            current_guess[i] = letter
            correct = True
    if not correct:
        session.tries += 1
    sessions[session_id].current_guess = "".join(current_guess)
    if "_" not in sessions[session_id].current_guess:
        sessions[session_id].status = "won"
    elif session.tries >= 6:
        sessions[session_id].status = "lost"
    return {
        "current_guess": sessions[session_id].current_guess,
        "tries": session.tries,
        "status": session.status
        }
