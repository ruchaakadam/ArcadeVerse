// =========================================
// ARCADEVERSE
// AIM TRAINER
// =========================================


// =========================================
// ELEMENTS
// =========================================

const gameArea =
    document.getElementById("gameArea");

const target =
    document.getElementById("target");

const startMessage =
    document.getElementById("startMessage");

const scoreElement =
    document.getElementById("score");

const timeElement =
    document.getElementById("time");

const accuracyElement =
    document.getElementById("accuracy");

const highScoreElement =
    document.getElementById("highScore");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalHits =
    document.getElementById("finalHits");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// =========================================
// GAME VARIABLES
// =========================================

let gameRunning = false;

let score = 0;

let timeLeft = 30;

let hits = 0;

let clicks = 0;

let timer = null;

let highScore =
    Number(
        localStorage.getItem(
            "aimTrainerHighScore"
        )
    ) || 0;


highScoreElement.textContent =
    highScore;


// =========================================
// TARGET SETTINGS
// =========================================

let targetSize = 70;


// =========================================
// START GAME
// =========================================

function startGame() {

    if (gameRunning) {
        return;
    }


    gameRunning = true;

    score = 0;

    timeLeft = 30;

    hits = 0;

    clicks = 0;

    targetSize = 70;


    scoreElement.textContent =
        "0";

    timeElement.textContent =
        "30";

    accuracyElement.textContent =
        "100%";


    gameOver.classList.add(
        "hidden"
    );


    startMessage.classList.add(
        "hidden"
    );


    target.classList.remove(
        "hidden"
    );


    moveTarget();


    clearInterval(timer);


    timer =
        setInterval(
            updateTimer,
            1000
        );

}


// =========================================
// RESTART GAME
// =========================================

function restartGame() {

    clearInterval(timer);

    gameRunning = false;

    startGame();

}


// =========================================
// UPDATE TIMER
// =========================================

function updateTimer() {

    if (!gameRunning) {
        return;
    }


    timeLeft--;


    timeElement.textContent =
        timeLeft;


    if (timeLeft <= 0) {

        endGame();

    }

}


// =========================================
// MOVE TARGET
// =========================================

function moveTarget() {

    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;


    /*
        Keep target completely
        inside the game area.
    */

    const padding =
        targetSize / 2 + 10;


    const minX =
        padding;

    const maxX =
        areaWidth -
        padding;


    const minY =
        padding;

    const maxY =
        areaHeight -
        padding;


    const x =
        Math.random() *
        (
            maxX -
            minX
        ) +
        minX;


    const y =
        Math.random() *
        (
            maxY -
            minY
        ) +
        minY;


    target.style.left =
        `${x}px`;

    target.style.top =
        `${y}px`;


    target.style.width =
        `${targetSize}px`;

    target.style.height =
        `${targetSize}px`;

}


// =========================================
// TARGET CLICK
// =========================================

target.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (!gameRunning) {
            return;
        }


        hits++;

        clicks++;


        /*
            Smaller target =
            more points.
        */

        const points =
            targetSize <= 40
                ? 3
                : targetSize <= 55
                    ? 2
                    : 1;


        score += points;


        scoreElement.textContent =
            score;


        /*
            Increase difficulty.
        */

        if (
            targetSize > 38
        ) {

            targetSize -= 2;

        }


        updateAccuracy();

        moveTarget();

    }
);


// =========================================
// MISSED CLICK
// =========================================

gameArea.addEventListener(
    "click",
    function(event) {

        if (!gameRunning) {
            return;
        }


        /*
            If target itself was clicked,
            target handler already handled it.
        */

        if (
            event.target === target
        ) {

            return;

        }


        clicks++;


        updateAccuracy();

    }
);


// =========================================
// ACCURACY
// =========================================

function updateAccuracy() {

    if (clicks === 0) {

        accuracyElement.textContent =
            "100%";

        return;

    }


    const accuracy =
        Math.round(
            (
                hits /
                clicks
            ) *
            100
        );


    accuracyElement.textContent =
        `${accuracy}%`;

}


// =========================================
// END GAME
// =========================================

function endGame() {

    gameRunning = false;


    clearInterval(timer);


    target.classList.add(
        "hidden"
    );


    const accuracy =
        clicks === 0
            ? 0
            : Math.round(
                (
                    hits /
                    clicks
                ) *
                100
            );


    finalScore.textContent =
        score;


    finalAccuracy.textContent =
        `${accuracy}%`;


    finalHits.textContent =
        hits;


    /*
        Save high score.
    */

    if (
        score >
        highScore
    ) {

        highScore =
            score;


        highScoreElement.textContent =
            highScore;


        localStorage.setItem(
            "aimTrainerHighScore",
            highScore
        );

    }


    gameOver.classList.remove(
        "hidden"
    );

}


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
// INITIAL STATE
// =========================================

target.classList.add(
    "hidden"
);

gameOver.classList.add(
    "hidden"
);