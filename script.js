let board = ["", "", "", "", "", "", "", "", ""];
let player = 'X';
let bot = 'O';
let currentPlayer = 'X';
let gameActive = true;
let playerName = "";
let level = 1;
const maxLevel = 5;

const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const gameContainer = document.getElementById('gameContainer');
const namePrompt = document.getElementById('namePrompt');
const levelDiv = document.getElementById('level');

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGame() {
    const input = document.getElementById('playerName');
    playerName = input.value.trim() || "Go";
    namePrompt.style.display = 'none';
    gameContainer.style.display = 'block';
    level = 1;
    resetBoard();
    updateLevelDisplay();
    statusDiv.textContent = `${playerName}, it's your turn!`;
}

function updateLevelDisplay() {
    levelDiv.textContent = `Level: ${level}`;
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    resultDiv.textContent = '';
    resultDiv.className = '';
    renderBoard();
}

function renderBoard() {
    gameDiv.innerHTML = '';
    board.forEach((cell, index) => {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.dataset.index = index;
        div.textContent = cell;
        div.addEventListener('click', handleClick);
        gameDiv.appendChild(div);
    });
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || board[index] !== "") return;

    board[index] = player;
    renderBoard();
    if (checkWinner(player)) {
        endGame(true);
        return;
    }
    if (board.every(cell => cell !== "")) {
        endGame(null);
        return;
    }
    statusDiv.textContent = `Bot is thinking...`;
    setTimeout(botMove, 700);
}

function botMove() {
    let emptyIndexes = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = chooseBotMove(emptyIndexes);
    board[move] = bot;
    renderBoard();
    if (checkWinner(bot)) {
        endGame(false);
        return;
    }
    if (board.every(cell => cell !== "")) {
        endGame(null);
        return;
    }
    statusDiv.textContent = `${playerName}, it's your turn!`;
}

function chooseBotMove(available) {
    // Increase difficulty based on level
    if (level >= 2) {
        for (let i of available) {
            board[i] = bot;
            if (checkWinner(bot)) return i;
            board[i] = "";
        }
        for (let i of available) {
            board[i] = player;
            if (checkWinner(player)) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    return available[Math.floor(Math.random() * available.length)];
}

function checkWinner(symbol) {
    return winConditions.some(cond => cond.every(i => board[i] === symbol));
}

function endGame(playerWon) {
    gameActive = false;
    if (playerWon === true) {
        resultDiv.className = 'win';
        resultDiv.innerHTML = `✨ Congratulations ${playerName}!<br>You beat Level ${level}! ✨`;
        if (level < maxLevel) {
            level++;
            setTimeout(() => {
                resultDiv.innerHTML += `<br><strong>Now try Level ${level}!</strong>`;
                resetBoard();
                updateLevelDisplay();
                statusDiv.textContent = `${playerName}, it's your turn!`;
            }, 1500);
        } else {
            resultDiv.innerHTML += `<br><strong>You reached the final level! You're a master!</strong>`;
        }
    } else if (playerWon === false) {
        resultDiv.className = 'lose';
        resultDiv.innerHTML = `😞 Sorry ${playerName}, you lost Level ${level}.<br>Don't give up! Try again from Level ${Math.max(1, level - 1)}!`;
        level = Math.max(1, level - 1);
        setTimeout(() => {
            resetBoard();
            updateLevelDisplay();
            statusDiv.textContent = `${playerName}, it's your turn!`;
        }, 2000);
    } else {
        resultDiv.className = '';
        resultDiv.innerHTML = `😐 It's a draw, ${playerName}. Try again!`;
        setTimeout(() => {
            resetBoard();
            statusDiv.textContent = `${playerName}, it's your turn!`;
        }, 1500);
    }
}

function restartGame() {
    level = 1;
    updateLevelDisplay();
    resetBoard();
    statusDiv.textContent = `${playerName}, it's your turn!`;
}
