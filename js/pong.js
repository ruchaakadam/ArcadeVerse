// =========================================
// ARCADEVERSE
// PONG
// =========================================


// =========================================
// CANVAS
// =========================================

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");


// =========================================
// HTML ELEMENTS
// =========================================

const playerScoreElement =
    document.getElementById("playerScore");

const aiScoreElement =
    document.getElementById("aiScore");

const highScoreElement =
    document.getElementById("highScore");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const gameOver =
    document.getElementById("gameOver");

const gameOverTitle =
    document.getElementById("gameOverTitle");

const finalScore =
    document.getElementById("finalScore");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// =========================================
// GAME SETTINGS
// =========================================

const winningScore = 5;

let gameRunning = false;

let animationId = null;

let playerScore = 0;

let aiScore = 0;


// =========================================
// HIGH SCORE
// =========================================

let highScore =
    Number(
        localStorage.getItem("pongHighScore")
    ) || 0;

highScoreElement.textContent = highScore;


// =========================================
// PADDLE SETTINGS
// =========================================

const paddle = {

    width: 14,

    height: 100,

    speed: 7

};


// =========================================
// PLAYER
// =========================================

const player = {

    x: 25,

    y:
        canvas.height / 2 -
        paddle.height / 2,

    dy: 0

};


// =========================================
// AI
// =========================================

const ai = {

    x:
        canvas.width -
        25 -
        paddle.width,

    y:
        canvas.height / 2 -
        paddle.height / 2

};


// =========================================
// BALL
// =========================================

const ball = {

    x:
        canvas.width / 2,

    y:
        canvas.height / 2,

    radius: 9,

    dx: 6,

    dy: 3

};


// =========================================
// KEYBOARD STATE
// =========================================

const keys = {

    up: false,

    down: false

};


// =========================================
// RESET BALL
// =========================================

function resetBall(direction) {

    ball.x =
        canvas.width / 2;

    ball.y =
        canvas.height / 2;


    ball.dx =
        direction * 6;


    ball.dy =
        Math.random() > 0.5
            ? 3
            : -3;

}


// =========================================
// RESET PADDLES
// =========================================

function resetPaddles() {

    player.y =
        canvas.height / 2 -
        paddle.height / 2;


    ai.y =
        canvas.height / 2 -
        paddle.height / 2;


    player.dy = 0;

}


// =========================================
// NEW MATCH
// =========================================

function newMatch() {

    playerScore = 0;

    aiScore = 0;


    playerScoreElement.textContent = "0";

    aiScoreElement.textContent = "0";


    resetPaddles();

    resetBall(
        Math.random() > 0.5
            ? 1
            : -1
    );

}


// =========================================
// START FIRST MATCH
// =========================================

function startGame() {

    /*
        If someone is currently playing,
        don't start another loop.
    */

    if (gameRunning) {

        return;

    }


    /*
        If the match has already ended
        at 5 points, create a completely
        new match.
    */

    if (
        playerScore >= winningScore ||
        aiScore >= winningScore
    ) {

        newMatch();

    }


    /*
        Start the next round without
        resetting the score.
    */

    resetPaddles();


    resetBall(
        Math.random() > 0.5
            ? 1
            : -1
    );


    hideOverlay();


    gameRunning = true;


    gameLoop();

}


// =========================================
// RESTART MATCH
// =========================================

function restartGame() {

    cancelAnimationFrame(
        animationId
    );


    newMatch();

    hideOverlay();


    gameRunning = true;


    gameLoop();

}


// =========================================
// HIDE OVERLAY
// =========================================

function hideOverlay() {

    gameOver.classList.add(
        "hidden"
    );

}


// =========================================
// MOVE PLAYER
// =========================================

function movePlayer() {

    if (keys.up) {

        player.y -= paddle.speed;

    }


    if (keys.down) {

        player.y += paddle.speed;

    }


    /*
        Keep player inside canvas.
    */

    if (player.y < 0) {

        player.y = 0;

    }


    if (
        player.y +
        paddle.height >
        canvas.height
    ) {

        player.y =
            canvas.height -
            paddle.height;

    }

}


// =========================================
// MOVE AI
// =========================================

function moveAI() {

    const aiCenter =
        ai.y +
        paddle.height / 2;


    const difference =
        ball.y -
        aiCenter;


    const aiSpeed = 4.5;


    if (
        difference > 10
    ) {

        ai.y += aiSpeed;

    }


    else if (
        difference < -10
    ) {

        ai.y -= aiSpeed;

    }


    if (ai.y < 0) {

        ai.y = 0;

    }


    if (
        ai.y +
        paddle.height >
        canvas.height
    ) {

        ai.y =
            canvas.height -
            paddle.height;

    }

}


// =========================================
// MOVE BALL
// =========================================

function moveBall() {

    ball.x += ball.dx;

    ball.y += ball.dy;


    /*
        Top wall
    */

    if (
        ball.y -
        ball.radius <=
        0
    ) {

        ball.y =
            ball.radius;

        ball.dy =
            Math.abs(ball.dy);

    }


    /*
        Bottom wall
    */

    if (
        ball.y +
        ball.radius >=
        canvas.height
    ) {

        ball.y =
            canvas.height -
            ball.radius;

        ball.dy =
            -Math.abs(ball.dy);

    }

}


// =========================================
// PLAYER COLLISION
// =========================================

function playerCollision() {

    if (

        ball.x -
        ball.radius <=
        player.x +
        paddle.width &&

        ball.x +
        ball.radius >=
        player.x &&

        ball.y +
        ball.radius >=
        player.y &&

        ball.y -
        ball.radius <=
        player.y +
        paddle.height &&

        ball.dx < 0

    ) {

        ball.x =
            player.x +
            paddle.width +
            ball.radius;


        const hitPosition =
            (
                ball.y -
                (
                    player.y +
                    paddle.height / 2
                )
            ) /
            (
                paddle.height / 2
            );


        ball.dy =
            hitPosition * 5;


        ball.dx =
            Math.abs(ball.dx);


        increaseBallSpeed();

    }

}


// =========================================
// AI COLLISION
// =========================================

function aiCollision() {

    if (

        ball.x +
        ball.radius >=
        ai.x &&

        ball.x -
        ball.radius <=
        ai.x +
        paddle.width &&

        ball.y +
        ball.radius >=
        ai.y &&

        ball.y -
        ball.radius <=
        ai.y +
        paddle.height &&

        ball.dx > 0

    ) {

        ball.x =
            ai.x -
            ball.radius;


        const hitPosition =
            (
                ball.y -
                (
                    ai.y +
                    paddle.height / 2
                )
            ) /
            (
                paddle.height / 2
            );


        ball.dy =
            hitPosition * 5;


        ball.dx =
            -Math.abs(ball.dx);


        increaseBallSpeed();

    }

}


// =========================================
// INCREASE BALL SPEED
// =========================================

function increaseBallSpeed() {

    const maxSpeed = 11;


    if (
        Math.abs(ball.dx) <
        maxSpeed
    ) {

        ball.dx *= 1.05;

    }


    if (
        Math.abs(ball.dy) <
        maxSpeed
    ) {

        ball.dy *= 1.03;

    }

}


// =========================================
// CHECK SCORE
// =========================================

function checkScore() {

    /*
        AI scores
    */

    if (
        ball.x +
        ball.radius <
        0
    ) {

        aiScore++;

        aiScoreElement.textContent =
            aiScore;


        updateHighScore();


        /*
            If AI reaches 5,
            MATCH IS OVER.
        */

        if (
            aiScore >=
            winningScore
        ) {

            endMatch(false);

            return;

        }


        /*
            Otherwise only the
            ROUND ends.
        */

        endRound();

        return;

    }


    /*
        PLAYER scores
    */

    if (
        ball.x -
        ball.radius >
        canvas.width
    ) {

        playerScore++;

        playerScoreElement.textContent =
            playerScore;


        updateHighScore();


        /*
            If player reaches 5,
            MATCH IS OVER.
        */

        if (
            playerScore >=
            winningScore
        ) {

            endMatch(true);

            return;

        }


        /*
            Otherwise only the
            ROUND ends.
        */

        endRound();

    }

}


// =========================================
// END ROUND
// =========================================

function endRound() {

    /*
        STOP GAME LOOP
    */

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    /*
        Show round-over message.
    */

    gameOverTitle.textContent =
        "🏁 Round Over!";


    finalScore.textContent =
        `${playerScore} - ${aiScore}`;


    /*
        Change button text.
    */

    playAgainBtn.textContent =
        "▶ Start Next Round";


    gameOver.classList.remove(
        "hidden"
    );

}


// =========================================
// END MATCH
// =========================================

function endMatch(playerWon) {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    if (playerWon) {

        gameOverTitle.textContent =
            "🏆 You Win!";

    }

    else {

        gameOverTitle.textContent =
            "🤖 AI Wins!";

    }


    finalScore.textContent =
        `${playerScore} - ${aiScore}`;


    playAgainBtn.textContent =
        "🎮 New Match";


    gameOver.classList.remove(
        "hidden"
    );

}


// =========================================
// HIGH SCORE
// =========================================

function updateHighScore() {

    if (
        playerScore >
        highScore
    ) {

        highScore =
            playerScore;


        highScoreElement.textContent =
            highScore;


        localStorage.setItem(
            "pongHighScore",
            highScore
        );

    }

}


// =========================================
// DRAW BACKGROUND
// =========================================

function drawBackground() {

    ctx.fillStyle =
        "#050b1d";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Center line
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.15)";

    ctx.lineWidth = 3;

    ctx.setLineDash([
        12,
        12
    ]);


    ctx.beginPath();

    ctx.moveTo(
        canvas.width / 2,
        0
    );

    ctx.lineTo(
        canvas.width / 2,
        canvas.height
    );

    ctx.stroke();


    ctx.setLineDash([]);

}


// =========================================
// DRAW PADDLE
// =========================================

function drawPaddle(paddleObject) {

    ctx.fillStyle =
        "#60a5fa";


    ctx.beginPath();


    ctx.roundRect(
        paddleObject.x,
        paddleObject.y,
        paddle.width,
        paddle.height,
        7
    );


    ctx.fill();

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


    ctx.fillStyle =
        "#ffffff";


    ctx.shadowColor =
        "#60a5fa";

    ctx.shadowBlur = 15;


    ctx.fill();


    ctx.shadowBlur = 0;

}


// =========================================
// DRAW CANVAS SCORE
// =========================================

function drawCanvasScore() {

    ctx.font =
        "bold 80px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";


    ctx.fillText(
        playerScore,
        canvas.width / 2 - 100,
        100
    );


    ctx.fillText(
        aiScore,
        canvas.width / 2 + 100,
        100
    );

}


// =========================================
// DRAW EVERYTHING
// =========================================

function draw() {

    drawBackground();

    drawCanvasScore();

    drawPaddle(player);

    drawPaddle(ai);

    drawBall();

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    movePlayer();

    moveAI();

    moveBall();

    playerCollision();

    aiCollision();

    checkScore();

    draw();


    /*
        Only continue animation
        if the game is still running.
    */

    if (gameRunning) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );

    }

}


// =========================================
// KEYBOARD DOWN
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowUp"
        ) {

            event.preventDefault();

            keys.up = true;

        }


        if (
            event.key ===
            "ArrowDown"
        ) {

            event.preventDefault();

            keys.down = true;

        }


        if (
            event.key ===
            "w"
        ) {

            keys.up = true;

        }


        if (
            event.key ===
            "s"
        ) {

            keys.down = true;

        }


        /*
            Space starts the next round.
        */

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                startGame();

            }

        }

    }
);


// =========================================
// KEYBOARD UP
// =========================================

document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowUp" ||
            event.key === "w"
        ) {

            keys.up = false;

        }


        if (
            event.key === "ArrowDown" ||
            event.key === "s"
        ) {

            keys.down = false;

        }

    }
);


// =========================================
// MOUSE CONTROL
// =========================================

canvas.addEventListener(
    "mousemove",
    function(event) {

        if (!gameRunning) {

            return;

        }


        const rect =
            canvas.getBoundingClientRect();


        const scaleY =
            canvas.height /
            rect.height;


        const mouseY =
            (
                event.clientY -
                rect.top
            ) *
            scaleY;


        player.y =
            mouseY -
            paddle.height / 2;


        if (player.y < 0) {

            player.y = 0;

        }


        if (
            player.y +
            paddle.height >
            canvas.height
        ) {

            player.y =
                canvas.height -
                paddle.height;

        }

    }
);


// =========================================
// TOUCH CONTROL
// =========================================

canvas.addEventListener(
    "touchmove",
    function(event) {

        if (!gameRunning) {

            return;

        }


        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const touch =
            event.touches[0];


        const scaleY =
            canvas.height /
            rect.height;


        const touchY =
            (
                touch.clientY -
                rect.top
            ) *
            scaleY;


        player.y =
            touchY -
            paddle.height / 2;


        if (player.y < 0) {

            player.y = 0;

        }


        if (
            player.y +
            paddle.height >
            canvas.height
        ) {

            player.y =
                canvas.height -
                paddle.height;

        }

    },
    {
        passive: false
    }
);


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
    startGame
);


// =========================================
// INITIAL STATE
// =========================================

newMatch();

draw();