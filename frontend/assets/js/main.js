import { createSession, makeGuess } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
    let currentSession = null;
    const board = document.getElementById('board');
    const rows = board.querySelectorAll('.row');
    const tiles = board.querySelectorAll('.tile');
    const keyboard = document.getElementById('keyboard');
    const keys = keyboard.querySelectorAll('.key');
});

let currentRow = 0;
let currentTile = 0;
let guesses = [];

const startGameBtn = document.querySelector('.start-game-btn');
startGameBtn.addEventListener('click', startGame);

keys.forEach(key => {
    key.addEventListener('click', handleKeyClick);
});

document.addEventListener('keydown', handleKeyPress);

async function startGame() {
    try {
        const sessionData = await createSession();
        currentSession = sessionData;
        console.log('New session created:', sessionData);
        // Redirect to the game page
        window.location.href = 'game.html';
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

function handleKeyClick(e) {
    const key = e.target.textContent;
    handleInput(key);
}

function handleKeyPress(e) {
    const key = e.key.toUpperCase();
    handleInput(key);
}

function handleInput(key) {
    if (key === 'ENTER') {
        submitGuess();
        return;
    }

    if (key === 'DEL' || key === 'BACKSPACE') {
        deleteLetter();
        return;
    }

    if (isLetter(key) && currentTile < 5) {
        addLetter(key);
    }
}

function addLetter(letter) {
    const tile = rows[currentRow].querySelectorAll('.tile')[currentTile];
    tile.textContent = letter;
    currentTile++;
}

function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const tile = rows[currentRow].querySelectorAll('.tile')[currentTile];
        tile.textContent = '';
    }
}

function submitGuess() {
    if (currentTile === 5) {
        const guess = getGuessFromRow(currentRow);
        guesses.push(guess);
        console.log('Submitted guess:', guess);
        makeGuess(currentSession.session_id, guess)
            .then(response => {
                console.log('API response:', response);
                // Handle the API response and update the game state
            })
            .catch(error => {
                console.error('Error making guess:', error);
            });
        currentTile = 0;
        currentRow++;
    }
}

function getGuessFromRow(rowIndex) {
    const row = rows[rowIndex];
    const tiles = row.querySelectorAll('.tile');
    let guess = '';
    tiles.forEach(tile => {
        guess += tile.textContent;
    });
    return guess;
}

function isLetter(str) {
    return str.length === 1 && /[a-zA-Z]/.test(str);
}
