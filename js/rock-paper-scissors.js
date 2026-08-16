// ========================================
// ROCK PAPER SCISSORS
// ========================================

const choices = document.querySelectorAll(".choice");

const playerScoreElement =
    document.getElementById("player-score");

const computerScoreElement =
    document.getElementById("computer-score");

const resultElement =
    document.getElementById("result");

const movesElement =
    document.getElementById("moves");

const restartButton =
    document.getElementById("restart-btn");


// ========================================
// GAME SETTINGS
// ========================================

const MAX_ROUNDS = 10;

let playerScore = 0;
let computerScore = 0;
let currentRound = 0;

const choicesList = [
    "rock",
    "paper",
    "scissors"
];


// ========================================
// HIGHEST SCORE
// ========================================

let highestScore =
    Number(localStorage.getItem("rpsHighestScore")) || 0;


// Create highest score display
const scoreboard = document.querySelector(".scoreboard");

const highestScoreBox = document.createElement("div");

highestScoreBox.innerHTML = `
    <span>Highest</span>
    <strong id="highest-score">${highestScore}</strong>
`;

scoreboard.appendChild(highestScoreBox);

const highestScoreElement =
    document.getElementById("highest-score");


// ========================================
// ROUND DISPLAY
// ========================================

const roundDisplay = document.createElement("p");

roundDisplay.id = "round-display";
roundDisplay.textContent =
    `Round 0 / ${MAX_ROUNDS}`;

roundDisplay.style.fontWeight = "bold";
roundDisplay.style.marginBottom = "20px";

scoreboard.parentElement.insertBefore(
    roundDisplay,
    scoreboard
);


// ========================================
// PLAYER CHOICE
// ========================================

choices.forEach((button) => {

    button.addEventListener("click", () => {

        // Don't allow moves after 10 rounds
        if (currentRound >= MAX_ROUNDS) {
            return;
        }

        const playerChoice =
            button.dataset.choice;

        const computerChoice =
            choicesList[
                Math.floor(
                    Math.random() * choicesList.length
                )
            ];

        playRound(
            playerChoice,
            computerChoice
        );

    });

});


// ========================================
// PLAY ROUND
// ========================================

function playRound(
    playerChoice,
    computerChoice
) {

    currentRound++;

    let roundResult = "";


    // DRAW
    if (playerChoice === computerChoice) {

        roundResult =
            "It's a Draw! 🤝";

    }


    // PLAYER WINS
    else if (
        (playerChoice === "rock" &&
            computerChoice === "scissors") ||

        (playerChoice === "paper" &&
            computerChoice === "rock") ||

        (playerChoice === "scissors" &&
            computerChoice === "paper")
    ) {

        playerScore++;

        roundResult =
            "You Win! 🎉";

    }


    // COMPUTER WINS
    else {

        computerScore++;

        roundResult =
            "Computer Wins! 🤖";

    }


    // Update score
    playerScoreElement.textContent =
        playerScore;

    computerScoreElement.textContent =
        computerScore;


    // Update round
    roundDisplay.textContent =
        `Round ${currentRound} / ${MAX_ROUNDS}`;


    // Show result
    resultElement.textContent =
        roundResult;


    movesElement.textContent =
        `You chose ${capitalize(playerChoice)} • Computer chose ${capitalize(computerChoice)}`;


    // Check whether match is finished
    if (currentRound === MAX_ROUNDS) {

        finishMatch();

    }

}


// ========================================
// FINISH MATCH
// ========================================

function finishMatch() {

    // Update highest score
    if (playerScore > highestScore) {

        highestScore = playerScore;

        localStorage.setItem(
            "rpsHighestScore",
            highestScore
        );

        highestScoreElement.textContent =
            highestScore;

    }


    // Decide final winner
    if (playerScore > computerScore) {

        resultElement.textContent =
            "🏆 You Won the Match!";

    }

    else if (computerScore > playerScore) {

        resultElement.textContent =
            "🤖 Computer Won the Match!";

    }

    else {

        resultElement.textContent =
            "🤝 The Match is a Draw!";

    }


    movesElement.textContent =
        `Final Score: You ${playerScore} - ${computerScore} Computer`;


    // Disable choices
    choices.forEach((button) => {

        button.disabled = true;

        button.style.opacity = "0.5";
        button.style.cursor = "not-allowed";

    });

}


// ========================================
// CAPITALIZE
// ========================================

function capitalize(word) {

    return word.charAt(0).toUpperCase()
        + word.slice(1);

}


// ========================================
// RESTART GAME
// ========================================

restartButton.addEventListener("click", () => {

    playerScore = 0;
    computerScore = 0;
    currentRound = 0;


    playerScoreElement.textContent = "0";
    computerScoreElement.textContent = "0";


    roundDisplay.textContent =
        `Round 0 / ${MAX_ROUNDS}`;


    resultElement.textContent =
        "Choose your move!";


    movesElement.textContent = "";


    // Enable choices again
    choices.forEach((button) => {

        button.disabled = false;

        button.style.opacity = "1";
        button.style.cursor = "pointer";

    });

});