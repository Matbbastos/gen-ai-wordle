const API_BASE_URL = 'http://localhost:8000';

// Function to create a new session
export async function createSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/create_session`, {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

// Function to make a guess
export async function makeGuess(sessionId, letter) {
  try {
    const response = await fetch(`${API_BASE_URL}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId, letter: letter }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error making guess:', error);
    throw error;
  }
}
