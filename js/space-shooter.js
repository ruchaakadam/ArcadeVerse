// =========================================
// ARCADEVERSE
// SPACE SHOOTER
// =========================================


// =========================================
// CANVAS
// =========================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// =========================================
// HTML ELEMENTS
// =========================================

const scoreElement =
    document.getElementById("score");

const livesElement =
    document.getElementById("lives");

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
// GAME STATE
// =========================================

let gameRunning = false;

let animationId = null;

let score = 0;

let lives = 3;

let highScore =
    Number(
        localStorage.getItem(
            "spaceShooterHighScore"
        )
    ) || 0;


// =========================================
// DIFFICULTY
// =========================================

let enemySpeed = 2;

let spawnRate = 900;

let lastEnemySpawn = 0;


// =========================================
// PLAYER
// =========================================

const player = {

    x:
        canvas.width / 2 - 25,

    y:
        canvas.height - 80,

    width: 50,

    height: 40,

    speed: 7

};


// =========================================
// ARRAYS
// =========================================

let bullets = [];

let enemies = [];

let stars = [];


// =========================================
// KEYBOARD
// =========================================

const keys = {

    left: false,

    right: false,

    shoot: false

};


// =========================================
// CREATE STARS
// =========================================

function createStars() {

    stars = [];


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            size:
                Math.random() * 2 + 1,

            speed:
                Math.random() * 1.5 + 0.5

        });

    }

}


// =========================================
// RESET GAME
// =========================================

function resetGame() {

    score = 0;

    lives = 3;

    enemySpeed = 2;

    spawnRate = 900;

    lastEnemySpawn = 0;


    bullets = [];

    enemies = [];


    player.x =
        canvas.width / 2 -
        player.width / 2;


    player.y =
        canvas.height -
        80;


    updateScore();

    updateLives();

    createStars();

}


// =========================================
// START GAME
// =========================================

function startGame() {

    if (gameRunning) {

        return;

    }


    /*
        If previous match ended,
        start a completely new game.
    */

    if (lives <= 0) {

        resetGame();

    }


    hideGameOver();


    gameRunning = true;


    cancelAnimationFrame(
        animationId
    );


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
// HIDE GAME OVER
// =========================================

function hideGameOver() {

    gameOver.classList.add(
        "hidden"
    );

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
            "spaceShooterHighScore",
            highScore
        );

    }

}


// =========================================
// UPDATE LIVES
// =========================================

function updateLives() {

    let hearts = "";

    for (
        let i = 0;
        i < lives;
        i++
    ) {

        hearts += "❤️";

    }


    if (lives === 0) {

        hearts = "💀";

    }


    livesElement.textContent =
        hearts;

}


// =========================================
// MOVE PLAYER
// =========================================

function movePlayer() {

    if (keys.left) {

        player.x -=
            player.speed;

    }


    if (keys.right) {

        player.x +=
            player.speed;

    }


    /*
        Keep spaceship inside
        the canvas.
    */

    if (
        player.x < 0
    ) {

        player.x = 0;

    }


    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }

}


// =========================================
// SHOOT
// =========================================

let lastShot = 0;

function shoot(timestamp) {

    if (!keys.shoot) {

        return;

    }


    /*
        Prevent bullets from
        being created every frame.
    */

    if (
        timestamp -
        lastShot <
        180
    ) {

        return;

    }


    lastShot =
        timestamp;


    bullets.push({

        x:
            player.x +
            player.width / 2 -
            3,

        y:
            player.y,

        width:
            6,

        height:
            18,

        speed:
            9

    });

}


// =========================================
// UPDATE BULLETS
// =========================================

function updateBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        bullets[i].y -=
            bullets[i].speed;


        /*
            Remove bullets that
            leave the screen.
        */

        if (
            bullets[i].y +
            bullets[i].height <
            0
        ) {

            bullets.splice(
                i,
                1
            );

        }

    }

}


// =========================================
// CREATE ENEMY
// =========================================

function createEnemy() {

    const size =
        Math.random() * 15 + 30;


    enemies.push({

        x:
            Math.random() *
            (
                canvas.width -
                size
            ),

        y:
            -size,

        width:
            size,

        height:
            size,

        speed:
            enemySpeed +
            Math.random() * 1.5,

        rotation:
            0,

        rotationSpeed:
            (
                Math.random() -
                0.5
            ) *
            0.08

    });

}


// =========================================
// UPDATE ENEMIES
// =========================================

function updateEnemies() {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];


        enemy.y +=
            enemy.speed;


        enemy.rotation +=
            enemy.rotationSpeed;


        /*
            Enemy reaches bottom.
        */

        if (
            enemy.y >
            canvas.height
        ) {

            enemies.splice(
                i,
                1
            );


            loseLife();

        }

    }

}


// =========================================
// UPDATE STARS
// =========================================

function updateStars() {

    for (
        const star of stars
    ) {

        star.y +=
            star.speed;


        if (
            star.y >
            canvas.height
        ) {

            star.y = 0;

            star.x =
                Math.random() *
                canvas.width;

        }

    }

}


// =========================================
// COLLISION CHECK
// =========================================

function collision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


// =========================================
// BULLET VS ENEMY
// =========================================

function checkBulletCollisions() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            if (
                collision(
                    bullets[i],
                    enemies[j]
                )
            ) {

                /*
                    Remove bullet.
                */

                bullets.splice(
                    i,
                    1
                );


                /*
                    Remove enemy.
                */

                enemies.splice(
                    j,
                    1
                );


                /*
                    Increase score.
                */

                score += 10;

                updateScore();


                /*
                    Increase difficulty.
                */

                increaseDifficulty();


                break;

            }

        }

    }

}


// =========================================
// PLAYER VS ENEMY
// =========================================

function checkPlayerCollisions() {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            collision(
                player,
                enemies[i]
            )
        ) {

            enemies.splice(
                i,
                1
            );


            loseLife();

        }

    }

}


// =========================================
// LOSE LIFE
// =========================================

function loseLife() {

    if (!gameRunning) {

        return;

    }


    lives--;

    updateLives();


    /*
        Remove enemies and bullets
        when player gets hit.
    */

    bullets = [];

    enemies = [];


    /*
        Game ends when all lives
        are gone.
    */

    if (
        lives <= 0
    ) {

        endGame();

    }

}


// =========================================
// INCREASE DIFFICULTY
// =========================================

function increaseDifficulty() {

    /*
        Every 50 points the game
        gets slightly harder.
    */

    if (
        score % 50 === 0
    ) {

        enemySpeed +=
            0.35;


        spawnRate =
            Math.max(
                350,
                spawnRate - 50
            );

    }

}


// =========================================
// DRAW BACKGROUND
// =========================================

function drawBackground() {

    ctx.fillStyle =
        "#020617";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Stars
    */

    for (
        const star of stars
    ) {

        ctx.fillStyle =
            "rgba(255,255,255,0.8)";


        ctx.beginPath();


        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );


        ctx.fill();

    }

}


// =========================================
// DRAW PLAYER
// =========================================

function drawPlayer() {

    const centerX =
        player.x +
        player.width / 2;


    const bottomY =
        player.y +
        player.height;


    /*
        Outer glow
    */

    ctx.shadowColor =
        "#60a5fa";

    ctx.shadowBlur =
        20;


    /*
        Main spaceship
    */

    ctx.fillStyle =
        "#60a5fa";


    ctx.beginPath();


    ctx.moveTo(
        centerX,
        player.y
    );


    ctx.lineTo(
        player.x +
        player.width,
        bottomY
    );


    ctx.lineTo(
        centerX,
        bottomY - 12
    );


    ctx.lineTo(
        player.x,
        bottomY
    );


    ctx.closePath();


    ctx.fill();


    ctx.shadowBlur = 0;


    /*
        Cockpit
    */

    ctx.fillStyle =
        "#dbeafe";


    ctx.beginPath();


    ctx.arc(
        centerX,
        player.y + 20,
        7,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /*
        Engine flame
    */

    ctx.fillStyle =
        "#f97316";


    ctx.beginPath();


    ctx.moveTo(
        centerX - 7,
        bottomY - 2
    );


    ctx.lineTo(
        centerX,
        bottomY + 15
    );


    ctx.lineTo(
        centerX + 7,
        bottomY - 2
    );


    ctx.closePath();


    ctx.fill();

}


// =========================================
// DRAW BULLETS
// =========================================

function drawBullets() {

    for (
        const bullet of bullets
    ) {

        ctx.fillStyle =
            "#facc15";


        ctx.shadowColor =
            "#facc15";

        ctx.shadowBlur =
            10;


        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );


        ctx.shadowBlur = 0;

    }

}


// =========================================
// DRAW ENEMY
// =========================================

function drawEnemy(enemy) {

    ctx.save();


    ctx.translate(
        enemy.x +
        enemy.width / 2,

        enemy.y +
        enemy.height / 2
    );


    ctx.rotate(
        enemy.rotation
    );


    /*
        Enemy glow
    */

    ctx.shadowColor =
        "#ef4444";

    ctx.shadowBlur =
        15;


    ctx.fillStyle =
        "#ef4444";


    /*
        Draw alien-like shape.
    */

    ctx.beginPath();


    ctx.moveTo(
        0,
        -enemy.height / 2
    );


    ctx.lineTo(
        enemy.width / 2,
        enemy.height / 3
    );


    ctx.lineTo(
        enemy.width / 4,
        enemy.height / 2
    );


    ctx.lineTo(
        0,
        enemy.height / 3
    );


    ctx.lineTo(
        -enemy.width / 4,
        enemy.height / 2
    );


    ctx.lineTo(
        -enemy.width / 2,
        enemy.height / 3
    );


    ctx.closePath();


    ctx.fill();


    ctx.shadowBlur = 0;


    /*
        Enemy eyes.
    */

    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();


    ctx.arc(
        -7,
        -3,
        4,
        0,
        Math.PI * 2
    );


    ctx.arc(
        7,
        -3,
        4,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.fillStyle =
        "#000000";


    ctx.beginPath();


    ctx.arc(
        -7,
        -3,
        2,
        0,
        Math.PI * 2
    );


    ctx.arc(
        7,
        -3,
        2,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}


// =========================================
// DRAW ENEMIES
// =========================================

function drawEnemies() {

    for (
        const enemy of enemies
    ) {

        drawEnemy(enemy);

    }

}


// =========================================
// SPAWN ENEMIES
// =========================================

function spawnEnemies(timestamp) {

    if (
        timestamp -
        lastEnemySpawn <
        spawnRate
    ) {

        return;

    }


    lastEnemySpawn =
        timestamp;


    createEnemy();


    /*
        Occasionally create a
        second enemy as difficulty
        increases.
    */

    if (
        score >= 100 &&
        Math.random() < 0.2
    ) {

        createEnemy();

    }

}


// =========================================
// END GAME
// =========================================

function endGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    updateScore();


    gameOverTitle.textContent =
        "💀 Game Over!";


    finalScore.textContent =
        score;


    playAgainBtn.textContent =
        "🚀 Play Again";


    gameOver.classList.remove(
        "hidden"
    );

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop(timestamp = 0) {

    if (!gameRunning) {

        return;

    }


    /*
        Update
    */

    movePlayer();

    shoot(timestamp);

    updateBullets();

    updateEnemies();

    updateStars();

    spawnEnemies(timestamp);

    checkBulletCollisions();

    checkPlayerCollisions();


    /*
        Draw
    */

    drawBackground();

    drawPlayer();

    drawBullets();

    drawEnemies();


    /*
        Continue animation
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
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            event.preventDefault();

            keys.left = true;

        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            event.preventDefault();

            keys.right = true;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            keys.shoot = true;


            /*
                Space also starts
                the game.
            */

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
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            keys.left = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            keys.right = false;

        }


        if (
            event.code === "Space"
        ) {

            keys.shoot = false;

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


        const scaleX =
            canvas.width /
            rect.width;


        const mouseX =
            (
                event.clientX -
                rect.left
            ) *
            scaleX;


        player.x =
            mouseX -
            player.width / 2;


        if (player.x < 0) {

            player.x = 0;

        }


        if (
            player.x +
            player.width >
            canvas.width
        ) {

            player.x =
                canvas.width -
                player.width;

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


        const scaleX =
            canvas.width /
            rect.width;


        const touchX =
            (
                touch.clientX -
                rect.left
            ) *
            scaleX;


        player.x =
            touchX -
            player.width / 2;


        if (player.x < 0) {

            player.x = 0;

        }


        if (
            player.x +
            player.width >
            canvas.width
        ) {

            player.x =
                canvas.width -
                player.width;

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

drawBackground();

drawPlayer();