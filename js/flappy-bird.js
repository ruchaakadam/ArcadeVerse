// =========================================
// ARCADEVERSE
// FLAPPY BIRD
// =========================================


// =========================================
// CANVAS
// =========================================

const canvas =
    document.getElementById("flappyCanvas");

const ctx =
    canvas.getContext("2d");


// =========================================
// HTML ELEMENTS
// =========================================

const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("highScore");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const gameOverScreen =
    document.getElementById("gameOver");

const gameOverTitle =
    document.getElementById("gameOverTitle");

const finalScore =
    document.getElementById("finalScore");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// =========================================
// GAME STATE
// =========================================

let gameRunning = false;

let animationId = null;

let score = 0;

let highScore =
    Number(
        localStorage.getItem(
            "flappyBirdHighScore"
        )
    ) || 0;


highScoreElement.textContent =
    highScore;


// =========================================
// BIRD
// =========================================

const bird = {

    x: 80,

    y: 270,

    width: 30,

    height: 24,

    velocity: 0,

    gravity: 0.45,

    jumpStrength: -8

};


// =========================================
// PIPE SETTINGS
// =========================================

const pipe = {

    width: 60,

    gap: 160,

    speed: 2.6

};


let pipes = [];


// =========================================
// GROUND
// =========================================

const ground = {

    height: 55

};


// =========================================
// CREATE PIPE
// =========================================

function createPipe() {

    const minimumTop =
        70;

    const maximumTop =
        canvas.height -
        ground.height -
        pipe.gap -
        70;


    const topHeight =
        Math.floor(
            Math.random() *
            (
                maximumTop -
                minimumTop
            )
        ) +
        minimumTop;


    pipes.push({

        x: canvas.width,

        topHeight: topHeight,

        scored: false

    });

}


// =========================================
// RESET BIRD
// =========================================

function resetBird() {

    bird.x = 80;

    bird.y = 270;

    bird.velocity = 0;

}


// =========================================
// RESET GAME
// =========================================

function resetGame() {

    score = 0;

    scoreElement.textContent = "0";

    pipes = [];

    resetBird();

    /*
        Start with ONE pipe.
        More pipes are added automatically.
    */

    createPipe();

}


// =========================================
// HIDE GAME OVER
// =========================================

function hideGameOver() {

    gameOverScreen.classList.add(
        "hidden"
    );

}


// =========================================
// SHOW GAME OVER
// =========================================

function showGameOver() {

    finalScore.textContent =
        score;

    gameOverScreen.classList.remove(
        "hidden"
    );

}


// =========================================
// JUMP
// =========================================

function jump() {

    if (!gameRunning) {

        return;

    }


    bird.velocity =
        bird.jumpStrength;

}


// =========================================
// START GAME
// =========================================

function startGame() {

    if (gameRunning) {

        return;

    }


    cancelAnimationFrame(
        animationId
    );


    resetGame();

    hideGameOver();

    gameRunning = true;

    gameLoop();

}


// =========================================
// RESTART GAME
// =========================================

function restartGame() {

    cancelAnimationFrame(
        animationId
    );


    resetGame();

    hideGameOver();

    gameRunning = true;

    gameLoop();

}


// =========================================
// UPDATE BIRD
// =========================================

function updateBird() {

    bird.velocity +=
        bird.gravity;

    bird.y +=
        bird.velocity;


    // Ceiling

    if (bird.y < 0) {

        bird.y = 0;

        bird.velocity = 0;

    }


    // Ground

    const groundTop =
        canvas.height -
        ground.height;


    if (
        bird.y +
        bird.height >=
        groundTop
    ) {

        bird.y =
            groundTop -
            bird.height;

        endGame();

    }

}


// =========================================
// UPDATE PIPES
// =========================================

function updatePipes() {

    for (
        let i = 0;
        i < pipes.length;
        i++
    ) {

        pipes[i].x -=
            pipe.speed;


        /*
            Give the player one point
            after passing a pipe.
        */

        if (
            !pipes[i].scored &&
            pipes[i].x +
            pipe.width <
            bird.x
        ) {

            pipes[i].scored = true;

            score++;

            updateScore();

        }

    }


    /*
        Remove pipes that are
        completely off screen.
    */

    pipes =
        pipes.filter(
            currentPipe =>
                currentPipe.x +
                pipe.width >
                0
        );


    /*
        Create another pipe when
        the last pipe gets close
        to the player.
    */

    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x <
        canvas.width - 220
    ) {

        createPipe();

    }

}


// =========================================
// COLLISION DETECTION
// =========================================

function checkCollision() {

    for (
        const currentPipe of pipes
    ) {

        const pipeX =
            currentPipe.x;

        const topHeight =
            currentPipe.topHeight;

        const bottomY =
            topHeight +
            pipe.gap;


        /*
            Horizontal overlap
        */

        const horizontalCollision =

            bird.x +
            bird.width >
            pipeX &&

            bird.x <
            pipeX +
            pipe.width;


        if (!horizontalCollision) {

            continue;

        }


        /*
            Hit top pipe
        */

        if (
            bird.y <
            topHeight
        ) {

            endGame();

            return;

        }


        /*
            Hit bottom pipe
        */

        if (
            bird.y +
            bird.height >
            bottomY
        ) {

            endGame();

            return;

        }

    }

}


// =========================================
// UPDATE SCORE
// =========================================

function updateScore() {

    scoreElement.textContent =
        score;


    if (
        score >
        highScore
    ) {

        highScore =
            score;


        highScoreElement.textContent =
            highScore;


        localStorage.setItem(
            "flappyBirdHighScore",
            highScore
        );

    }

}


// =========================================
// DRAW BACKGROUND
// =========================================

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#38bdf8"
    );


    gradient.addColorStop(
        1,
        "#bae6fd"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Clouds

    drawCloud(
        70,
        105,
        1
    );


    drawCloud(
        285,
        170,
        0.8
    );

}


// =========================================
// DRAW CLOUD
// =========================================

function drawCloud(
    x,
    y,
    scale
) {

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        20 * scale,
        0,
        Math.PI * 2
    );


    ctx.arc(
        x +
        25 * scale,
        y -
        8 * scale,
        25 * scale,
        0,
        Math.PI * 2
    );


    ctx.arc(
        x +
        50 * scale,
        y,
        20 * scale,
        0,
        Math.PI * 2
    );


    ctx.fill();

}


// =========================================
// DRAW BIRD
// =========================================

function drawBird() {

    ctx.save();


    /*
        Rotate bird based on
        its vertical velocity.
    */

    const rotation =
        Math.min(
            Math.max(
                bird.velocity *
                0.06,
                -0.4
            ),
            1
        );


    ctx.translate(
        bird.x +
        bird.width / 2,

        bird.y +
        bird.height / 2
    );


    ctx.rotate(
        rotation
    );


    // Body

    ctx.fillStyle =
        "#facc15";


    ctx.beginPath();


    ctx.ellipse(
        0,
        0,
        16,
        13,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Wing

    ctx.fillStyle =
        "#f59e0b";


    ctx.beginPath();


    ctx.ellipse(
        -5,
        5,
        9,
        5,
        -0.3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Eye

    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();


    ctx.arc(
        7,
        -6,
        5,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Pupil

    ctx.fillStyle =
        "#000000";


    ctx.beginPath();


    ctx.arc(
        8,
        -6,
        2,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Beak

    ctx.fillStyle =
        "#f97316";


    ctx.beginPath();


    ctx.moveTo(
        15,
        0
    );


    ctx.lineTo(
        27,
        5
    );


    ctx.lineTo(
        15,
        8
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();

}


// =========================================
// DRAW PIPES
// =========================================

function drawPipes() {

    for (
        const currentPipe of pipes
    ) {

        const x =
            currentPipe.x;

        const topHeight =
            currentPipe.topHeight;

        const bottomY =
            topHeight +
            pipe.gap;


        // Pipe body

        ctx.fillStyle =
            "#22c55e";


        // TOP PIPE

        ctx.fillRect(
            x,
            0,
            pipe.width,
            topHeight
        );


        // TOP CAP

        ctx.fillRect(
            x - 5,
            topHeight - 18,
            pipe.width + 10,
            18
        );


        // BOTTOM PIPE

        ctx.fillRect(
            x,
            bottomY,
            pipe.width,
            canvas.height -
            ground.height -
            bottomY
        );


        // BOTTOM CAP

        ctx.fillRect(
            x - 5,
            bottomY,
            pipe.width + 10,
            18
        );

    }

}


// =========================================
// DRAW GROUND
// =========================================

function drawGround() {

    const groundY =
        canvas.height -
        ground.height;


    // Ground

    ctx.fillStyle =
        "#84cc16";


    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        ground.height
    );


    // Ground line

    ctx.fillStyle =
        "#65a30d";


    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        8
    );

}


// =========================================
// DRAW EVERYTHING
// =========================================

function draw() {

    drawBackground();

    drawPipes();

    drawGround();

    drawBird();

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    updateBird();

    updatePipes();

    checkCollision();

    draw();


    if (gameRunning) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );

    }

}


// =========================================
// END GAME
// =========================================

function endGame() {

    if (!gameRunning) {

        return;

    }


    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    gameOverTitle.textContent =
        "💀 Game Over!";


    showGameOver();

}


// =========================================
// KEYBOARD CONTROLS
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            /*
                If game hasn't started,
                Space starts it.
                Otherwise Space jumps.
            */

            if (!gameRunning) {

                startGame();

            } else {

                jump();

            }

        }

    }
);


// =========================================
// MOUSE CONTROL
// =========================================

canvas.addEventListener(
    "click",
    function() {

        if (!gameRunning) {

            startGame();

        } else {

            jump();

        }

    }
);


// =========================================
// TOUCH CONTROL
// =========================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        if (!gameRunning) {

            startGame();

        } else {

            jump();

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
    restartGame
);


// =========================================
// INITIALIZATION
// =========================================

resetGame();

draw();