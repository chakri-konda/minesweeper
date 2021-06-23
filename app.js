
const board = document.getElementById('board');
const flagsLeft = document.getElementById('flags-left');
const result = document.getElementById('result');

// global vars
let size = 8;
let tempGrid = [];
let bombCount = 16;
let flags = 0;
let grid = [];
let isGameOver = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// change difficulty
function changeDifficulty() {
    let difficulty = document.getElementById('difficulty').value;
    const root = document.querySelector(':root');
    
    if (difficulty == "easy") {
        console.log("easy selected");
        root.style.setProperty('--cell-size', '60px');
        root.style.setProperty('--item-font-size', '35px');
        size = 8;
        bombCount = 16;
    } else if (difficulty == "medium") {
        console.log("medium selected");
        root.style.setProperty('--cell-size', '40px');
        root.style.setProperty('--item-font-size', '25px');
        size = 12;
        bombCount = 25;
    } else {
        console.log("hard selected");
        root.style.setProperty('--cell-size', '30px');
        root.style.setProperty('--item-font-size', '20px');
        size = 16;
        bombCount = 35;
    }      
    createBoard();
}

// create board
function createBoard() {
    isGameOver = false;
    result.innerHTML = "";
    board.innerHTML = "";
    tempGrid = [];
    grid = [];
    flags = 0;
    flagsLeft.innerHTML = bombCount;
    
    for (let i = 0; i < size+2; ++i) {
        let row = [];
        for (let j = 0; j < size+2; ++j) {
            row.push("valid");
        }
        tempGrid.push(row);
    }
    
    let bombs = 0;
    while (bombs < bombCount) {
        let i = getRandomInt(1, size);
        let j = getRandomInt(1, size);
        if (tempGrid[i][j] == "valid") {
            tempGrid[i][j] = "bomb";
            bombs++;
        }
    }
    
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i+"-"+j);
            
            let total = 0;
            if (tempGrid[i][j] == "valid") {
                if (tempGrid[i-1][j-1] == "bomb") total++;
                if (tempGrid[i-1][j] == "bomb") total++;
                if (tempGrid[i-1][j+1] == "bomb") total++;
                if (tempGrid[i][j-1] == "bomb") total++;
                if (tempGrid[i][j+1] == "bomb") total++;
                if (tempGrid[i+1][j-1] == "bomb") total++;
                if (tempGrid[i+1][j] == "bomb") total++;
                if (tempGrid[i+1][j+1] == "bomb") total++;
                
                cell.setAttribute('data', total)
            }
            
            cell.classList.add(tempGrid[i][j]);
            board.appendChild(cell);
            grid.push(cell);
            
            cell.addEventListener('click', function(e) {
                click(cell);
            });
            
            cell.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(cell);
            }
        }
    }

    console.log(board);
}

// flag toggle
function addFlag(cell) {
    if (isGameOver) return;
    if (!cell.classList.contains('checked')) {
        if (cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            cell.innerHTML = '';
            flags--;
            flagsLeft.innerHTML = bombCount - flags;
        } else {
            if (flags < bombCount) {   
                cell.classList.add('flag');
                cell.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombCount - flags;
            }
        }
    }
    checkForWin();
}

//click on square actions
function click(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
    if (cell.classList.contains('bomb')) {
        gameOver(cell);
    } else {
        let total = cell.getAttribute('data')
        if (total != 0) {
            cell.classList.add('checked');
            if (total == 1) cell.classList.add('one');
            if (total == 2) cell.classList.add('two');
            if (total == 3) cell.classList.add('three');
            if (total == 4) cell.classList.add('four');
            cell.innerHTML = total;
            return;
        }
        let currentId = cell.id;
        let ij = currentId.split('-');
        checkSquare(cell, parseInt(ij[0]), parseInt(ij[1]));
    }
    cell.classList.add('checked')
}

// open empty square
function checkSquare(cell, i, j) {
    if (i < 1 || j < 1 || i > size || j > size) return;
    
    setTimeout(() => {
        for (let p = i-1; p <= i+1; ++p) {
            for (let q = j-1; q <= j+1; ++q) {
                if (p < 1 || q < 1 || p > size || q > size) continue;
                const newID = p+"-"+q;
                const newCell = document.getElementById(newID);
                console.log(newID);

                click(newCell);
            }
        }
    }, 10);
}

function gameOver(cell) {
    result.innerHTML = "Boom! Game Over!";
    isGameOver = true;
    console.log("LOST");

    grid.forEach(cell => {
        if (cell.classList.contains('bomb')) {
            cell.innerHTML = '💣';
            cell.classList.remove('bomb');
            cell.classList.add('checked');
        }
    });
}

function checkForWin() {
    let matches = 0;
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            const id = i + "-" + j;
            const cell = document.getElementById(id);

            if (cell.classList.contains('flag') && cell.classList.contains('bomb')) {
                matches++;
            }
            if (matches == bombCount) {
                console.log("WON");
                result.innerHTML = "Winner Winner, Chicken Dinner!";
                isGameOver = true;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();      
});