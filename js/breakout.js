// =========================================
// ARCADEVERSE - BREAKOUT
// =========================================

const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");


// =========================================
// GAME ELEMENTS
// =========================================

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const livesElement = document.getElementById("lives");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOverScreen = document.getElementById("gameOver");
const gameOverTitle = document.getElementById("gameOverTitle");
const finalScore = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");


// =========================================
// GAME VARIABLES
// =========================================

let gameRunning = false;
let animationId;

let score = 0;
let lives = 3;

let highScore =
    Number(localStorage.getItem("breakoutHighScore")) || 0;

highScoreElement.textContent = highScore;


// =========================================
// PADDLE
// =========================================

const paddle = {
    width: 100,
    height: 12,

    x: canvas.width / 2 - 50,
    y: canvas.height - 35,

    speed: 8,

    dx: 0
};


// =========================================
// BALL
// =========================================

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,

    radius: 8,

    speed: 5,

    dx: 4,
    dy: -4
};


// =========================================
// BRICKS
// =========================================

const brick = {
    rowCount: 5,
    columnCount: 9,

    width: 55,
    height: 20,

    padding: 10,

    offsetTop: 50,
    offsetLeft: 22
};


let bricks = [];


// =========================================
// CREATE BRICKS
// =========================================

function createBricks() {

    bricks = [];

    for (let row = 0; row < brick.rowCount; row++) {

        bricks[row] = [];

        for (let column = 0; column < brick.columnCount; column++) {

            bricks[row][column] = {
                x: 0,
                y: 0,
                visible: true
            };

        }

    }

}


// =========================================
// RESET BALL
// =========================================

function resetBall() {

    ball.x = canvas.width / 2;

    ball.y = canvas.height - 60;

    ball.dx = 4;

    ball.dy = -4;

}


// =========================================
// RESET PADDLE
// =========================================

function resetPaddle() {

    paddle.x =
        canvas.width / 2 - paddle.width / 2;

    paddle.dx = 0;

}


// =========================================
// DRAW BALL
// =========================================

function drawBall() {

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();

    ctx.closePath();

}


// =========================================
// DRAW PADDLE
// =========================================

function drawPaddle() {

    ctx.beginPath();

    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        6
    );

    ctx.fillStyle = "#3b82f6";

    ctx.fill();

    ctx.closePath();

}


// =========================================
// DRAW BRICKS
// =========================================

function drawBricks() {

    for (let row = 0; row < brick.rowCount; row++) {

        for (
            let column = 0;
            column < brick.columnCount;
            column++
        ) {

            const currentBrick =
                bricks[row][column];

            if (!currentBrick.visible) {
                continue;
            }


            const brickX =
                column *
                    (brick.width + brick.padding)
                + brick.offsetLeft;


            const brickY =
                row *
                    (brick.height + brick.padding)
                + brick.offsetTop;


            currentBrick.x = brickX;
            currentBrick.y = brickY;


            ctx.beginPath();

            ctx.roundRect(
                brickX,
                brickY,
                brick.width,
                brick.height,
                5
            );

            ctx.fillStyle = "#60a5fa";

            ctx.fill();

            ctx.closePath();

        }

    }

}


// =========================================
// DRAW EVERYTHING
// =========================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawBricks();

    drawBall();

    drawPaddle();

}


// =========================================
// MOVE PADDLE
// =========================================

function movePaddle() {

    paddle.x += paddle.dx;


    if (paddle.x < 0) {

        paddle.x = 0;

    }


    if (
        paddle.x + paddle.width >
        canvas.width
    ) {

        paddle.x =
            canvas.width - paddle.width;

    }

}


// =========================================
// MOVE BALL
// =========================================

function moveBall() {

    ball.x += ball.dx;

    ball.y += ball.dy;


    // LEFT WALL

    if (
        ball.x - ball.radius < 0
    ) {

        ball.x = ball.radius;

        ball.dx *= -1;

    }


    // RIGHT WALL

    if (
        ball.x + ball.radius >
        canvas.width
    ) {

        ball.x =
            canvas.width - ball.radius;

        ball.dx *= -1;

    }


    // TOP WALL

    if (
        ball.y - ball.radius < 0
    ) {

        ball.y = ball.radius;

        ball.dy *= -1;

    }


    // BOTTOM

    if (
        ball.y + ball.radius >
        canvas.height
    ) {

        loseLife();

    }

}


// =========================================
// PADDLE COLLISION
// =========================================

function paddleCollision() {

    if (

        ball.x + ball.radius >= paddle.x &&

        ball.x - ball.radius <=
        paddle.x + paddle.width &&

        ball.y + ball.radius >= paddle.y &&

        ball.y - ball.radius <=
        paddle.y + paddle.height &&

        ball.dy > 0

    ) {

        ball.y =
            paddle.y - ball.radius;

        ball.dy *= -1;


        // Change direction depending
        // on where the ball hits paddle

        const hitPoint =
            ball.x -
            (paddle.x + paddle.width / 2);


        ball.dx =
            hitPoint * 0.08;

    }

}


// =========================================
// BRICK COLLISION
// =========================================

function brickCollision() {

    for (
        let row = 0;
        row < brick.rowCount;
        row++
    ) {

        for (
            let column = 0;
            column < brick.columnCount;
            column++
        ) {

            const currentBrick =
                bricks[row][column];


            if (!currentBrick.visible) {
                continue;
            }


            if (

                ball.x + ball.radius >
                currentBrick.x &&

                ball.x - ball.radius <
                currentBrick.x + brick.width &&

                ball.y + ball.radius >
                currentBrick.y &&

                ball.y - ball.radius <
                currentBrick.y + brick.height

            ) {

                currentBrick.visible = false;

                ball.dy *= -1;

                score += 10;

                updateScore();

                checkWin();

                return;

            }

        }

    }

}


// =========================================
// SCORE
// =========================================

function updateScore() {

    scoreElement.textContent = score;


    if (score > highScore) {

        highScore = score;

        highScoreElement.textContent =
            highScore;

        localStorage.setItem(
            "breakoutHighScore",
            highScore
        );

    }

}


// =========================================
// LIVES
// =========================================

function updateLives() {

    livesElement.textContent =
        "❤️".repeat(lives);

}


// =========================================
// LOSE LIFE
// =========================================

function loseLife() {

    lives--;

    updateLives();


    if (lives <= 0) {

        endGame(false);

        return;

    }


    resetBall();

    resetPaddle();

}


// =========================================
// CHECK WIN
// =========================================

function checkWin() {

    let remainingBricks = 0;


    for (
        let row = 0;
        row < brick.rowCount;
        row++
    ) {

        for (
            let column = 0;
            column < brick.columnCount;
            column++
        ) {

            if (
                bricks[row][column].visible
            ) {

                remainingBricks++;

            }

        }

    }


    if (remainingBricks === 0) {

        endGame(true);

    }

}


// =========================================
// END GAME
// =========================================

function endGame(won) {

    gameRunning = false;

    cancelAnimationFrame(animationId);


    if (won) {

        gameOverTitle.textContent =
            "🎉 You Win!";

    } else {

        gameOverTitle.textContent =
            "💀 Game Over!";

    }


    finalScore.textContent = score;

    gameOverScreen.classList.remove("hidden");

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    draw();

    movePaddle();

    moveBall();

    paddleCollision();

    brickCollision();


    animationId =
        requestAnimationFrame(gameLoop);

}


// =========================================
// START GAME
// =========================================

function startGame() {

    if (gameRunning) {
        return;
    }


    gameRunning = true;

    gameOverScreen.classList.add("hidden");

    gameLoop();

}


// =========================================
// RESTART GAME
// =========================================

function restartGame() {

    cancelAnimationFrame(animationId);


    score = 0;

    lives = 3;


    updateScore();

    updateLives();


    resetBall();

    resetPaddle();

    createBricks();


    gameOverScreen.classList.add("hidden");


    gameRunning = true;

    gameLoop();

}


// =========================================
// KEYBOARD CONTROLS
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            paddle.dx = -paddle.speed;

        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            paddle.dx = paddle.speed;

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (

            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "a" ||
            event.key === "d"

        ) {

            paddle.dx = 0;

        }

    }
);


// =========================================
// BUTTON EVENTS
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
// INITIALIZE
// =========================================

createBricks();

updateLives();

draw();