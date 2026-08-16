const memoryBoard = document.getElementById("memoryBoard");
const movesElement = document.getElementById("moves");
const pairsElement = document.getElementById("pairs");
const restartBtn = document.getElementById("restartBtn");
const memoryPopup = document.getElementById("memoryPopup");
const finalMessage = document.getElementById("finalMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

const symbols = ["🎮", "🐍", "⭐", "🧠"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let pairs = 0;

function shuffle(array){
    return array.sort(() => Math.random() - 0.5);
}

function createBoard(){
    cards = shuffle([...symbols, ...symbols]);
    memoryBoard.innerHTML = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    pairs = 0;

    movesElement.textContent = moves;
    pairsElement.textContent = "0 / 4";
    memoryPopup.classList.remove("show");

    cards.forEach((symbol, index) => {
        const card = document.createElement("button");
        card.className = "memory-card";
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = "?";

        card.addEventListener("click", () => flipCard(card));

        memoryBoard.appendChild(card);
    });
}

function flipCard(card){
    if(
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ){
        return;
    }

    card.classList.add("flipped");
    card.textContent = card.dataset.symbol;

    if(!firstCard){
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;
    movesElement.textContent = moves;

    if(firstCard.dataset.symbol === secondCard.dataset.symbol){
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        pairs++;
        pairsElement.textContent = `${pairs} / 4`;

        resetTurn();

        if(pairs === 4){
            setTimeout(showWinPopup, 400);
        }
    }else{
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.textContent = "?";
            secondCard.textContent = "?";

            resetTurn();
        }, 800);
    }
}

function resetTurn(){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function showWinPopup(){
    finalMessage.textContent = `You matched all 4 pairs in ${moves} moves!`;
    memoryPopup.classList.add("show");
}

restartBtn.addEventListener("click", createBoard);
playAgainBtn.addEventListener("click", createBoard);

createBoard();
