    # README.md
    # Hangman Game API
    This is a Python backend project built with FastAPI and Pydantic that implements a game of Hangman. The API allows users to create new game sessions, make guesses for a randomly selected word, and track the game's progress.

    ## Features
    - A set of words to play from, taken from an open dictionary via HTTP
    - Sessions that include an ID, secret word, current guess, number of tries, and status
    - An endpoint `create_session` that selects a random word from the set of words, stores a new session with a unique random UUID as the ID, and returns the session ID along with the initial empty guess
    - An endpoint `guess` that receives the session ID and the letter to guess, validating the number of tries up to 6

    ## Setup
    1. Create a virtual environment and activate it:
    ```bash
    python -m venv .venv
    source venv/bin/activate 
    # On Windows, use venv\Scripts\activate
    ```

    2. Install the required dependencies:
    ```bash
    python -m pip install fastapi uvicorn pydantic requests
    ```

    3. Run the application:
    ```bash
    uvicorn main:app --reload
    ```

    The API will be available at `http://localhost:8000`.

    ## Testing
    You can use cURL or a tool like Postman to test the API endpoints.

    ### Create a new session
    ```bash
    curl -X POST http://localhost:8000/create_session
    ```
    This will return a JSON response with the session ID and the initial empty guess.

    ### Make a guess
    ```bash
    curl -X POST http://localhost:8000/guess -H "Content-Type: application/json" -d '{"session_id": "YOUR_SESSION_ID", "letter": "a"}'
    ```

    Replace `YOUR_SESSION_ID` with the session ID obtained from the `create_session` endpoint, and `a` with the letter you want to guess.

    The response will contain the updated current guess, the number of tries, and the game status (`ongoing`, `won`, or `lost`).

    ### Retrieve the word list
    ```bash
    curl http://localhost:8000/word_list
    ```
    This endpoint returns the list of words currently used by the application.

    ### Get the selected word for a session
    ```bash
    curl http://localhost:8000/session/{YOUR_SESSION_ID}/word
    ```
    This endpoint returns the selected word for the given session ID. Replace `YOUR_SESSION_ID` with the actual session ID.

    ## Contributing
    Contributions are welcome! Please open an issue or submit a pull request.
