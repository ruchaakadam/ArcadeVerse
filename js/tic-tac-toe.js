// ======================================
// ELEMENTS
// ======================================

const cells = document.querySelectorAll(".cell");
const turnText = document.querySelector(".turn");
const restartBtn = document.querySelector(".restart-btn");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");

// ======================================
// GAME VARIABLES
// ======================================

let currentPlayer = "X";
let gameActive = true;

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let xScore = 0;
let oScore = 0;
let drawScore = 0;

// ======================================
// WINNING COMBINATIONS
// ======================================

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

// ======================================
// EVENT LISTENERS
// ======================================

cells.forEach((cell,index)=>{

    cell.addEventListener("click",()=>{

        handleCellClick(cell,index);

    });

});

restartBtn.addEventListener("click", restartGame);

closePopup.addEventListener("click", restartGame);

// ======================================
// HANDLE CELL CLICK
// ======================================

function handleCellClick(cell,index){

    if(board[index]!=="" || !gameActive){
        return;
    }

    board[index]=currentPlayer;

    cell.textContent=currentPlayer;

    if(currentPlayer==="X"){
        cell.classList.add("x");
    }else{
        cell.classList.add("o");
    }

    const winningCombo = checkWinner();

    if(winningCombo){

        gameActive=false;

        winningCombo.forEach(index=>{
            cells[index].classList.add("winner");
        });

        if(currentPlayer==="X"){

            xScore++;
            document.getElementById("xScore").textContent=xScore;

        }else{

            oScore++;
            document.getElementById("oScore").textContent=oScore;

        }

        turnText.style.display="none";

        popupText.innerHTML=`
            <h2>🏆 Player ${currentPlayer} Wins!</h2>
            <p>Congratulations!</p>
        `;

        popup.style.display="flex";

        setTimeout(()=>{
            popup.style.opacity="1";
            popup.style.pointerEvents="all";
        },10);

        return;
    }

    // DRAW

    if(board.every(cell=>cell!=="")){

        gameActive=false;

        drawScore++;
        document.getElementById("drawScore").textContent=drawScore;

        turnText.style.display="none";

        popupText.innerHTML=`
            <h2>🤝 It's a Draw!</h2>
            <p>Play Again?</p>
        `;

        popup.style.display="flex";

        setTimeout(()=>{
            popup.style.opacity="1";
            popup.style.pointerEvents="all";
        },10);

        return;
    }

    currentPlayer=currentPlayer==="X" ? "O" : "X";

    turnText.textContent=`Player ${currentPlayer}'s Turn`;

}

// ======================================
// CHECK WINNER
// ======================================

function checkWinner(){

    for(let combo of winningCombinations){

        const[a,b,c]=combo;

        if(

            board[a] &&
            board[a]===board[b] &&
            board[a]===board[c]

        ){

            return combo;

        }

    }

    return null;

}

// ======================================
// RESTART GAME
// ======================================

function restartGame(){

    board=[
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer="X";

    gameActive=true;

    turnText.style.display="block";
    turnText.textContent="Player X's Turn";

    cells.forEach(cell=>{

        cell.textContent="";

        cell.classList.remove("winner");
        cell.classList.remove("x");
        cell.classList.remove("o");

    });

    popup.style.opacity="0";
    popup.style.pointerEvents="none";

    setTimeout(()=>{

        popup.style.display="none";

    },250);

}