// =========================================
// ARCADEVERSE
// MINESWEEPER
// =========================================


// =========================================
// GAME SETTINGS
// =========================================

const ROWS = 10;
const COLS = 10;
const TOTAL_MINES = 10;


// =========================================
// HTML ELEMENTS
// =========================================

const gameBoard =
    document.getElementById("gameBoard");

const mineCountElement =
    document.getElementById("mineCount");

const timerElement =
    document.getElementById("timer");

const bestTimeElement =
    document.getElementById("bestTime");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const gameOver =
    document.getElementById("gameOver");

const gameOverTitle =
    document.getElementById("gameOverTitle");

const gameOverMessage =
    document.getElementById("gameOverMessage");

const finalTime =
    document.getElementById("finalTime");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// =========================================
// GAME VARIABLES
// =========================================

let board = [];

let gameRunning = false;

let gameStarted = false;

let timer = 0;

let timerInterval = null;

let revealedCells = 0;

let flaggedCells = 0;


// =========================================
// BEST TIME
// =========================================

let bestTime =
    Number(
        localStorage.getItem(
            "minesweeperBestTime"
        )
    ) || 0;


if (bestTime > 0) {

    bestTimeElement.textContent =
        `${bestTime}s`;

} else {

    bestTimeElement.textContent =
        "--";

}


// =========================================
// CREATE EMPTY BOARD
// =========================================

function createEmptyBoard() {

    board = [];

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        board[row] = [];

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            board[row][col] = {

                mine: false,

                revealed: false,

                flagged: false,

                adjacentMines: 0

            };

        }

    }

}


// =========================================
// PLACE MINES
// =========================================

function placeMines() {

    let minesPlaced = 0;


    while (
        minesPlaced <
        TOTAL_MINES
    ) {

        const row =
            Math.floor(
                Math.random() * ROWS
            );

        const col =
            Math.floor(
                Math.random() * COLS
            );


        if (
            !board[row][col].mine
        ) {

            board[row][col].mine = true;

            minesPlaced++;

        }

    }

}


// =========================================
// CALCULATE NUMBERS
// =========================================

function calculateNumbers() {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                board[row][col].mine
            ) {

                continue;

            }


            let mineCount = 0;


            for (
                let rowOffset = -1;
                rowOffset <= 1;
                rowOffset++
            ) {

                for (
                    let colOffset = -1;
                    colOffset <= 1;
                    colOffset++
                ) {

                    if (
                        rowOffset === 0 &&
                        colOffset === 0
                    ) {

                        continue;

                    }


                    const neighborRow =
                        row +
                        rowOffset;

                    const neighborCol =
                        col +
                        colOffset;


                    if (
                        neighborRow >= 0 &&
                        neighborRow < ROWS &&
                        neighborCol >= 0 &&
                        neighborCol < COLS
                    ) {

                        if (
                            board[
                                neighborRow
                            ][
                                neighborCol
                            ].mine
                        ) {

                            mineCount++;

                        }

                    }

                }

            }


            board[row][col].adjacentMines =
                mineCount;

        }

    }

}


// =========================================
// CREATE HTML BOARD
// =========================================

function renderBoard() {

    gameBoard.innerHTML = "";


    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            const cell =
                document.createElement("div");


            cell.classList.add("cell");


            cell.dataset.row =
                row;

            cell.dataset.col =
                col;


            /*
                LEFT CLICK
            */

            cell.addEventListener(
                "click",
                function() {

                    revealCell(
                        row,
                        col
                    );

                }
            );


            /*
                RIGHT CLICK
            */

            cell.addEventListener(
                "contextmenu",
                function(event) {

                    event.preventDefault();

                    toggleFlag(
                        row,
                        col
                    );

                }
            );


            gameBoard.appendChild(
                cell
            );

        }

    }

}


// =========================================
// START GAME
// =========================================

function startGame() {

    if (gameRunning) {

        return;

    }


    clearInterval(
        timerInterval
    );


    createEmptyBoard();

    placeMines();

    calculateNumbers();

    renderBoard();


    timer = 0;

    revealedCells = 0;

    flaggedCells = 0;


    timerElement.textContent =
        "0";


    mineCountElement.textContent =
        TOTAL_MINES;


    gameStarted = true;

    gameRunning = true;


    gameOver.classList.add(
        "hidden"
    );


    timerInterval =
        setInterval(
            function() {

                if (!gameRunning) {

                    return;

                }


                timer++;

                timerElement.textContent =
                    timer;

            },
            1000
        );

}


// =========================================
// RESTART GAME
// =========================================

function restartGame() {

    clearInterval(
        timerInterval
    );


    gameRunning = false;

    gameStarted = false;


    startGame();

}


// =========================================
// GET CELL ELEMENT
// =========================================

function getCellElement(
    row,
    col
) {

    return gameBoard.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );

}


// =========================================
// REVEAL CELL
// =========================================

function revealCell(
    row,
    col
) {

    if (!gameRunning) {

        return;

    }


    const cell =
        board[row][col];


    /*
        Don't reveal an already
        revealed or flagged cell.
    */

    if (
        cell.revealed ||
        cell.flagged
    ) {

        return;

    }


    /*
        Hit a mine.
    */

    if (cell.mine) {

        revealAllMines();

        endGame(false);

        return;

    }


    revealSafeCell(
        row,
        col
    );


    checkWin();

}


// =========================================
// REVEAL SAFE CELL
// =========================================

function revealSafeCell(
    row,
    col
) {

    if (
        row < 0 ||
        row >= ROWS ||
        col < 0 ||
        col >= COLS
    ) {

        return;

    }


    const cell =
        board[row][col];


    if (
        cell.revealed ||
        cell.flagged ||
        cell.mine
    ) {

        return;

    }


    cell.revealed = true;

    revealedCells++;


    const cellElement =
        getCellElement(
            row,
            col
        );


    if (!cellElement) {

        return;

    }


    cellElement.classList.add(
        "revealed"
    );


    const mineNumber =
        cell.adjacentMines;


    /*
        Show number.
    */

    if (
        mineNumber > 0
    ) {

        cellElement.textContent =
            mineNumber;


        cellElement.classList.add(
            `number-${mineNumber}`
        );

        return;

    }


    /*
        Empty cell.

        Automatically reveal
        surrounding empty cells.
    */

    for (
        let rowOffset = -1;
        rowOffset <= 1;
        rowOffset++
    ) {

        for (
            let colOffset = -1;
            colOffset <= 1;
            colOffset++
        ) {

            if (
                rowOffset === 0 &&
                colOffset === 0
            ) {

                continue;

            }


            revealSafeCell(
                row +
                    rowOffset,

                col +
                    colOffset
            );

        }

    }

}


// =========================================
// FLAG CELL
// =========================================

function toggleFlag(
    row,
    col
) {

    if (!gameRunning) {

        return;

    }


    const cell =
        board[row][col];


    if (cell.revealed) {

        return;

    }


    if (!cell.flagged) {

        /*
            Don't allow more flags
            than there are mines.
        */

        if (
            flaggedCells >=
            TOTAL_MINES
        ) {

            return;

        }


        cell.flagged = true;

        flaggedCells++;

    }

    else {

        cell.flagged = false;

        flaggedCells--;

    }


    updateCellDisplay(
        row,
        col
    );


    mineCountElement.textContent =
        TOTAL_MINES -
        flaggedCells;

}


// =========================================
// UPDATE CELL DISPLAY
// =========================================

function updateCellDisplay(
    row,
    col
) {

    const cell =
        board[row][col];

    const element =
        getCellElement(
            row,
            col
        );


    if (!element) {

        return;

    }


    element.classList.remove(
        "flagged"
    );


    if (cell.flagged) {

        element.classList.add(
            "flagged"
        );

        element.textContent =
            "🚩";

    }

    else {

        element.textContent =
            "";

    }

}


// =========================================
// REVEAL ALL MINES
// =========================================

function revealAllMines() {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                board[row][col].mine
            ) {

                const element =
                    getCellElement(
                        row,
                        col
                    );


                if (element) {

                    element.classList.add(
                        "revealed",
                        "mine"
                    );

                    element.textContent =
                        "💣";

                }

            }

        }

    }

}


// =========================================
// CHECK WIN
// =========================================

function checkWin() {

    const safeCells =
        ROWS *
        COLS -
        TOTAL_MINES;


    if (
        revealedCells >=
        safeCells
    ) {

        endGame(true);

    }

}


// =========================================
// END GAME
// =========================================

function endGame(
    won
) {

    gameRunning = false;


    clearInterval(
        timerInterval
    );


    if (won) {

        gameOverTitle.textContent =
            "🎉 You Win!";

        gameOverMessage.textContent =
            "You cleared the entire board!";


        /*
            Save best time.
        */

        if (
            bestTime === 0 ||
            timer < bestTime
        ) {

            bestTime = timer;


            bestTimeElement.textContent =
                `${bestTime}s`;


            localStorage.setItem(
                "minesweeperBestTime",
                bestTime
            );

        }

    }

    else {

        gameOverTitle.textContent =
            "💣 Game Over!";

        gameOverMessage.textContent =
            "You hit a mine!";

    }


    finalTime.textContent =
        timer;


    gameOver.classList.remove(
        "hidden"
    );

}


// =========================================
// BUTTONS
// =========================================

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    restartGame
);


playAgainBtn.addEventListener(
    "click",
    restartGame
);


// =========================================
// INITIAL STATE
// =========================================

createEmptyBoard();

renderBoard();

mineCountElement.textContent =
    TOTAL_MINES;

timerElement.textContent =
    "0";