// =======================================
// SNAKE GAME - ARCADEVERSE
// Part 1
// =======================================



// =======================================
// CANVAS
// =======================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 25;



// =======================================
// HTML ELEMENTS
// =======================================

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const popup = document.getElementById("gamePopup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

// =======================================
// SOUNDS
// =======================================

const eatSound = new Audio("../sounds/eat.mp3");
const gameOverSound = new Audio("../sounds/gameover.mp3");
eatSound.volume = 0.5;

gameOverSound.volume = 0.6;
// =======================================
// GAME VARIABLES
// =======================================

let score = 0;

let snake = [
    { x: 250, y: 250 }
];

let food = {
    x: 350,
    y: 150
};

let dx = box;
let dy = 0;



// =======================================
// DRAW BOARD
// =======================================

function drawBoard() {

    ctx.fillStyle = "#10264a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = "#355c91";

    for(let i=0;i<=canvas.width/box;i++){

        ctx.beginPath();
        ctx.moveTo(i*box,0);
        ctx.lineTo(i*box,canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,i*box);
        ctx.lineTo(canvas.width,i*box);
        ctx.stroke();

    }

}



// =======================================
// DRAW SNAKE
// =======================================

function drawSnake(){

    snake.forEach((segment,index)=>{

        if(index===0){

            ctx.fillStyle="#38bdf8";

        }

        else{

            ctx.fillStyle="#7dd3fc";

        }

        ctx.fillRect(segment.x,segment.y,box,box);

    });

}



// =======================================
// DRAW FOOD
// =======================================

function drawFood(){

    ctx.fillStyle="#ff4d4d";

    ctx.beginPath();

    ctx.arc(
        food.x+box/2,
        food.y+box/2,
        9,
        0,
        Math.PI*2
    );

    ctx.fill();

}



// =======================================
// KEYBOARD CONTROLS
// =======================================

document.addEventListener("keydown",changeDirection);

function changeDirection(e){

    if(e.key==="ArrowUp" && dy===0){

        dx=0;
        dy=-box;

    }

    else if(e.key==="ArrowDown" && dy===0){

        dx=0;
        dy=box;

    }

    else if(e.key==="ArrowLeft" && dx===0){

        dx=-box;
        dy=0;

    }

    else if(e.key==="ArrowRight" && dx===0){

        dx=box;
        dy=0;

    }

}



// =======================================
// INITIAL SCREEN
// =======================================

drawBoard();
drawFood();
drawSnake();
// =======================================
// GAME LOOP
// =======================================

let game = null;

function gameLoop() {

    // Draw board
    drawBoard();

    // Current head position
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // ===================================
    // WALL COLLISION
    // ===================================

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }

    // ===================================
    // SELF COLLISION
    // ===================================

    for (let segment of snake) {

        if (
            head.x === segment.x &&
            head.y === segment.y
        ) {
            gameOver();
            return;
        }

    }

    // Add new head
    snake.unshift(head);

    // ===================================
    // FOOD COLLISION
    // ===================================

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;
scoreElement.textContent = score;

eatSound.currentTime = 0;
eatSound.play();

generateFood();
        // Generate new food
       generateFood();

    } else {

        // Remove tail
        snake.pop();

    }

    // Draw everything again
    drawFood();
    drawSnake();

}
// =======================================
// HIGH SCORE
// =======================================

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.textContent = highScore;



// =======================================
// START GAME
// =======================================

startBtn.addEventListener("click", startGame);

function startGame() {

    if (game !== null) return;

    game = setInterval(gameLoop, 150);

}



// =======================================
// RESTART GAME
// =======================================

restartBtn.addEventListener("click", restartGame);

function restartGame() {

    clearInterval(game);
    game = null;

    score = 0;
    scoreElement.textContent = score;

    snake = [
        {
            x: 250,
            y: 250
        }
    ];

    dx = box;
    dy = 0;

    generateFood();
scoreElement.textContent = score;
highScoreElement.textContent = highScore;
    drawBoard();
    drawFood();
    drawSnake();

}



// =======================================
// GENERATE FOOD
// =======================================

function generateFood() {

    let validPosition = false;

    while (!validPosition) {

        food = {

            x: Math.floor(Math.random() * (canvas.width / box)) * box,

            y: Math.floor(Math.random() * (canvas.height / box)) * box

        };

        validPosition = true;

        for (let segment of snake) {

            if (
                segment.x === food.x &&
                segment.y === food.y
            ) {
                validPosition = false;
                break;
            }

        }

    }

}

// =======================================
// GAME OVER
// =======================================

function gameOver() {

    console.log("GAME OVER CALLED");

    clearInterval(game);
    game = null;
    gameOverSound.currentTime = 0;
gameOverSound.play();
    updateHighScore();

    popupTitle.textContent = "💀 Game Over";

    popupMessage.innerHTML = `
        Your Score : ${score}<br><br>
        High Score : ${highScore}
    `;

    popup.classList.add("show");

}

// =======================================
// UPDATE HIGH SCORE
// =======================================

function updateHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("snakeHighScore", highScore);

        highScoreElement.textContent = highScore;

    }

}
playAgainBtn.addEventListener("click",()=>{

    popup.classList.remove("show");

    restartGame();

    startGame();

});