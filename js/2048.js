// ========================================
// 2048 GAME
// ========================================

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const newGameButton = document.getElementById("new-game-btn");
const tryAgainButton = document.getElementById("try-again-btn");
const gameMessage = document.getElementById("game-message");

const SIZE = 4;
const WINNING_TILE = 2048;

let board = [];
let score = 0;
let gameWon = false;
let gameOver = false;


// ========================================
// HIGHEST SCORE
// ========================================

let highestScore =
    Number(localStorage.getItem("2048HighestScore")) || 0;


// Create highest score display
const scoreBox = document.querySelector(".score-box");

const highestScoreBox = document.createElement("div");

highestScoreBox.classList.add("score-box");

highestScoreBox.innerHTML = `
    <span>Highest</span>
    <strong id="highest-score">${highestScore}</strong>
`;

scoreBox.parentElement.appendChild(highestScoreBox);

const highestScoreElement =
    document.getElementById("highest-score");


// ========================================
// START GAME
// ========================================

function startGame() {

    board = Array.from(
        { length: SIZE },
        () => Array(SIZE).fill(0)
    );

    score = 0;
    gameWon = false;
    gameOver = false;

    scoreElement.textContent = score;

    gameMessage.classList.add("hidden");

    addRandomTile();
    addRandomTile();

    renderBoard();
}


// ========================================
// ADD RANDOM TILE
// ========================================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });

            }

        }

    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[
            Math.floor(
                Math.random() * emptyCells.length
            )
        ];

    board[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ========================================
// RENDER BOARD
// ========================================

function renderBoard() {

    boardElement.innerHTML = "";

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const tile =
                document.createElement("div");

            tile.classList.add("tile");

            const value = board[row][col];

            if (value !== 0) {

                tile.textContent = value;

                tile.classList.add(
                    `tile-${value}`
                );

            }

            boardElement.appendChild(tile);

        }

    }

    scoreElement.textContent = score;

    updateHighestScore();
}


// ========================================
// UPDATE HIGHEST SCORE
// ========================================

function updateHighestScore() {

    if (score > highestScore) {

        highestScore = score;

        localStorage.setItem(
            "2048HighestScore",
            highestScore
        );

        highestScoreElement.textContent =
            highestScore;
    }
}


// ========================================
// MOVE LEFT
// ========================================

function moveLeft() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const originalRow = [...board[row]];

        let numbers =
            board[row].filter(
                value => value !== 0
            );

        numbers = mergeNumbers(numbers);

        while (numbers.length < SIZE) {
            numbers.push(0);
        }

        board[row] = numbers;

        if (
            JSON.stringify(originalRow) !==
            JSON.stringify(numbers)
        ) {
            moved = true;
        }

    }

    return moved;
}


// ========================================
// MOVE RIGHT
// ========================================

function moveRight() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const originalRow = [...board[row]];

        let numbers =
            board[row]
                .filter(value => value !== 0)
                .reverse();

        numbers = mergeNumbers(numbers);

        while (numbers.length < SIZE) {
            numbers.push(0);
        }

        numbers.reverse();

        board[row] = numbers;

        if (
            JSON.stringify(originalRow) !==
            JSON.stringify(numbers)
        ) {
            moved = true;
        }

    }

    return moved;
}


// ========================================
// MOVE UP
// ========================================

function moveUp() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        const originalColumn = [];

        for (let row = 0; row < SIZE; row++) {

            originalColumn.push(
                board[row][col]
            );

        }

        let numbers =
            originalColumn.filter(
                value => value !== 0
            );

        numbers = mergeNumbers(numbers);

        while (numbers.length < SIZE) {
            numbers.push(0);
        }

        for (let row = 0; row < SIZE; row++) {

            board[row][col] =
                numbers[row];

        }

        if (
            JSON.stringify(originalColumn) !==
            JSON.stringify(numbers)
        ) {
            moved = true;
        }

    }

    return moved;
}


// ========================================
// MOVE DOWN
// ========================================

function moveDown() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        const originalColumn = [];

        for (let row = 0; row < SIZE; row++) {

            originalColumn.push(
                board[row][col]
            );

        }

        let numbers =
            originalColumn
                .filter(value => value !== 0)
                .reverse();

        numbers = mergeNumbers(numbers);

        while (numbers.length < SIZE) {
            numbers.push(0);
        }

        numbers.reverse();

        for (let row = 0; row < SIZE; row++) {

            board[row][col] =
                numbers[row];

        }

        if (
            JSON.stringify(originalColumn) !==
            JSON.stringify(numbers)
        ) {
            moved = true;
        }

    }

    return moved;
}


// ========================================
// MERGE NUMBERS
// ========================================

function mergeNumbers(numbers) {

    const result = [];

    for (let i = 0; i < numbers.length; i++) {

        if (
            i < numbers.length - 1 &&
            numbers[i] === numbers[i + 1]
        ) {

            const mergedValue =
                numbers[i] * 2;

            result.push(mergedValue);

            score += mergedValue;

            // Check for 2048
            if (
                mergedValue === WINNING_TILE &&
                !gameWon
            ) {

                gameWon = true;

            }

            i++;

        } else {

            result.push(numbers[i]);

        }

    }

    return result;
}


// ========================================
// CHECK GAME OVER
// ========================================

function canMove() {

    // Empty cell exists
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {
                return true;
            }

        }

    }


    // Horizontal matches
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE - 1; col++) {

            if (
                board[row][col] ===
                board[row][col + 1]
            ) {

                return true;

            }

        }

    }


    // Vertical matches
    for (let row = 0; row < SIZE - 1; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (
                board[row][col] ===
                board[row + 1][col]
            ) {

                return true;

            }

        }

    }

    return false;
}


// ========================================
// SHOW WIN MESSAGE
// ========================================

function showWinMessage() {

    gameWon = true;
    gameMessage.classList.remove("hidden");

    const title =
        gameMessage.querySelector("h2");

    const message =
        gameMessage.querySelector("p");

    title.textContent =
        "🎉 You Reached 2048!";

    message.textContent =
        `Amazing! Your score is ${score}.`;

    tryAgainButton.textContent =
        "Play Again";

}


// ========================================
// SHOW GAME OVER
// ========================================

function showGameOver() {

    gameOver = true;

    gameMessage.classList.remove("hidden");

    const title =
        gameMessage.querySelector("h2");

    const message =
        gameMessage.querySelector("p");

    title.textContent =
        "Game Over! 😢";

    message.textContent =
        `No more moves. Your score is ${score}.`;

    tryAgainButton.textContent =
        "Try Again";

}


// ========================================
// HANDLE MOVE
// ========================================

function handleMove(direction) {

    // Stop game after winning
    if (gameWon || gameOver) {
        return;
    }

    let moved = false;


    if (direction === "left") {
        moved = moveLeft();
    }

    if (direction === "right") {
        moved = moveRight();
    }

    if (direction === "up") {
        moved = moveUp();
    }

    if (direction === "down") {
        moved = moveDown();
    }


    if (moved) {

        // Add a new tile
        addRandomTile();

        renderBoard();


        // Check win
        if (gameWon) {

            updateHighestScore();

            showWinMessage();

            return;
        }


        // Check game over
        if (!canMove()) {

            updateHighestScore();

            showGameOver();

        }

    }

}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();


        if (
            [
                "arrowleft",
                "arrowright",
                "arrowup",
                "arrowdown",
                "w",
                "a",
                "s",
                "d"
            ].includes(key)
        ) {

            event.preventDefault();

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            handleMove("left");

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            handleMove("right");

        }


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            handleMove("up");

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            handleMove("down");

        }

    }
);


// ========================================
// BUTTONS
// ========================================

newGameButton.addEventListener(
    "click",
    startGame
);

tryAgainButton.addEventListener(
    "click",
    startGame
);


// ========================================
// START
// ========================================

startGame();