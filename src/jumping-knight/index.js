let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let interval = undefined;

document.onclick = function () {
    if (!interval) {
        interval = setInterval(function() {
            for (let i = 0; i < 1; i++) {
                stepKnight();
            }
            
            drawBoard(board);
        }, 0);
    } else {
        clearInterval(interval);
    }
}

let width = 880;
let height = 880;
canvas.width = width;
canvas.height = height;

let cols = 81;
let size = Math.floor(width / cols);

let knightPos = {
    x: (cols - 1) / 2,
    y: (cols - 1) / 2
};

let knightSteps = [
    {
        x: -1,
        y: -2
    },
    {
        x: 1,
        y: -2
    },
    {
        x: 2,
        y: -1
    },
    {
        x: 2,
        y: 1
    },
    {
        x: 1,
        y: 2
    },
    {
        x: -1,
        y: 2
    },
    {
        x: -2,
        y: 1
    },
    {
        x: -2,
        y: -1
    }
];

let board = createBoard();
setBoardNumbers(board);
let index = (cols - 1) / 2;
board[index][index].touched = true;
drawBoard(board);

function stepKnight() {
    let cellPos = knightSteps.reduce((prev, current) => {
        let currentUndefined = false;
        let prevUndefined = false;

        let currentStep = getStepNum(knightPos, current);

        if (!current || !board[currentStep.x] || !board[currentStep.x][currentStep.y] || board[currentStep.x][currentStep.y].touched) {
            currentUndefined = true;
        }
        
        if (!prev || !board[prev.x] || !board[prev.x][prev.y]) {
            prevUndefined = true;
        }

        if (currentUndefined) {
            if (prevUndefined) {
                return undefined;
            }

            return prev;
        } else {
            if (prevUndefined) {
                return currentStep;
            }
        }

        return board[currentStep.x][currentStep.y].number < board[prev.x][prev.y].number ? currentStep : prev;
    }, undefined);
    let cell = board[cellPos.x][cellPos.y];
    cell.touched = true;
    knightPos = cellPos;
    console.log(cell.number);

}

function getStepNum(pos, step) {
    let x = pos.x + step.x;
    let y = pos.y + step.y;
    return {x: x, y: y};
}

function createBoard() {
    let board = [];
    for (let i = 0; i < cols; i++) {
        let buf = [];
        for (let j = 0; j < cols; j++) {
            buf.push({number: i * cols + j, touched: false});
        }
        board.push(buf);
    }

    return board;
}

function drawBoard(board) {
    drawBackground(width, height);

    board.forEach((col, colIndex) => {
        col.forEach((cell, rowIndex) => {
            drawCell(colIndex * size, rowIndex * size, cell);
        });
    })

    drawKnight();
}

function setBoardNumbers(board) {
    let x = cols - 1;
    let y = cols - 1;
    let DIR_X_LEFT = 0;
    let DIR_Y_UP = 1;
    let DIR_X_RIGHT = 2;
    let DIR_Y_DOWN = 3;

    let direction = DIR_X_LEFT;

    for (let i = cols * cols; i > 0; i--) {
        if (!board[x] || !board[x][y] || board[x][y].touched) {
            switch (direction) {
                case DIR_X_LEFT: x++; break;
                case DIR_Y_UP: y++; break;
                case DIR_X_RIGHT: x--; break;
                case DIR_Y_DOWN: y--;
            }
            direction++;
            if (direction > 3) {
                direction = 0;
            }

            switch (direction) {
                case DIR_X_LEFT: x--; break;
                case DIR_Y_UP: y--; break;
                case DIR_X_RIGHT: x++; break;
                case DIR_Y_DOWN: y++;
            }
        }
        if (board[x][y].touched) {
            console.log("exit");
            break;
        }
        board[x][y].touched = true;
        board[x][y].number = i;

        switch (direction) {
            case DIR_X_LEFT: x--; break;
            case DIR_Y_UP: y--; break;
            case DIR_X_RIGHT: x++; break;
            case DIR_Y_DOWN: y++;
        }
    }

    board.forEach((col, colIndex) => {
        col.forEach((cell, rowIndex) => {
            cell.touched = false;
        });
    })
}

function drawBackground(w, h) {
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.fill();
}

function drawKnight() {
    ctx.beginPath();
    ctx.arc(knightPos.x * size + size / 2, knightPos.y * size + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCell(x, y, cell) {
    if (cell.touched) {
        fillRect(x, y);
    }
    drawRect(x, y);
    // drawText(x, y,cell.number);
}

function drawRect(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.stroke();
}

function fillRect(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    ctx.rect(x, y, size, size);
    ctx.fill();
}

function drawText(x, y, text) {
    ctx.beginPath();
    
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(text, x, y + size);
}
