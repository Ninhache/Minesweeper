const color = {
    mine:"red",
    empty:"#C0C0C0",
    number:[
        "#FFFFFF", // 0 useless
        "#0000FF", // 1
        "#00FF00", // 2
        "#FF0000", // 3
        "#000080", // 4
        "#008000", // 5
        "#800000", // 6
        "#000020", // 7
        "#002000", // 8
        "#200000"  // 9
    ]
}

class Cell {

    mine; // is mined
    revealed;
    neighborCount;
    i; // Position i in the map (2d array)
    j; // Position j in the map (2d array)
    x; // Position X on canvas
    y; // Position Y on canvas
    w; // Cell's size
    grid; // Map

    constructor(x, y, w, grid) {
        this.x = x * w;
        this.y = y * w;
        this.i = x;
        this.j = y;
        this.w = w;
        this.mine = (Math.random() > 0.10);
        this.revealed = false;
        this.state = 0;
        this.grid = grid;

        if(this.mine) {
            totalMine++;
        }
    }

    show() {
        
        rectS(this.x, this.y, this.w, "grey");
        if(this.revealed) {
            if(this.mine) {
                elipseF(this.x, this.y, this.w, color.mine)
            } else {
                rectF(this.x, this.y, this.w, color.empty)
                if(this.neighborCount>0) {
                    ctx.beginPath()
                    ctx.fillStyle = color.number[this.neighborCount]
                    ctx.strokeStyle = "#000"
                    ctx.font = "bold 18pt Courier";
                    ctx.fillText(this.neighborCount, this.x + this.w/2 - 5, this.y + this.w/2 + 5)
                    ctx.strokeText(this.neighborCount, this.x + this.w/2 - 5, this.y + this.w/2 + 5)
                    ctx.fill()
                    ctx.closePath();
                }
            }
        } 
        /*
        if (this.revealed) {
            if (this.mine) {
                rectF(this.x, this.y, this.w, "#32a");
                elipseF(this.x, this.y, this.w, "red")
            } else {
                //rectF(this.x, this.y, this.w, "#e0e");
                //ctx.fillText(this.neighborCount, this.x + this.w / 2 - 2, this.y + this.w / 2 + 2);
                if(this.neighborCount > 0) {
                    fillText(this.neighborCount, "#fff");
                }
            }
        } else {
            rectS(this.x, this.y, this.w, "#50F");
        }*/
    }

    contain(x, y) {
        return ((x > this.x && x < this.x + this.w) && (y > this.y && y < this.y + this.w));
    }

    countNeighboor() {
        let total = 0;
        if(this.mine) {
            this.neighborCount = -1;
            return;
        }

        for (let r = -1; r <= 1; r++) {
            let i = this.i + r;
            if (i < 0 || i >= this.grid.cols) continue;

            for (let c = -1; c <= 1; c++) {
                let j = this.j + c;
                if (j < 0 || j >= this.grid.rows) continue;

                const neighbor = this.grid.map[i][j];
                if (neighbor.mine) {
                    total++;
                }

            }
        }
        this.neighborCount = total;
    }

    reveal() {
        this.revealed = true;
        if (this.neighborCount === 0) {
            this.fillEmpty();
        }
    }

    fillEmpty() {
        for (let r = -1; r <= 1; r++) {
            let i = this.i + r;
            if (i < 0 || i >= this.grid.cols) continue;

            for (let c = -1; c <= 1; c++) {
                let j = this.j + c;
                if (j < 0 || j >= this.grid.rows) continue;

                const neighbor = this.grid.map[i][j];
                if (!neighbor.revealed) {
                    neighbor.reveal()
                }

            }
        }
    }

}

class Grid {

    map;
    w;

    constructor(rows, cols, w) {
        this.map = [];
        this.w = w;
        this.cols = cols;
        this.rows = rows;

        for (let r = 0; r < rows; r++) {
            const tmp = [];
            for (let c = 0; c < cols; c++) {
                tmp.push(new Cell(r, c, w, this));
            }
            this.map.push(tmp)
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.map[r][c].countNeighboor();
            }
        }
    }

    render() {
        ctx.clearRect(0,0, canvasWidth, canvasHeight)
        this.map.forEach(cellArray => {
            cellArray.forEach(cell => {
                cell.show()
            })
        })
    }

    reveal(x, y) {
        let revealedCell;
        this.map.forEach(cellArray => {
            cellArray.forEach(cell => {
                if (cell.contain(x, y)) {
                    cell.revealed = true;
                    revealedCell = cell;
                    // If the cell don't have any neighbors, go "look around"
                    if (cell.neighborCount == 0) {
                        cell.fillEmpty();
                    }
                }
            })
        })
        return revealedCell;
    }

    endgame() {
        this.map.forEach(cellArray => {
            cellArray.forEach(cell => {
                cell.revealed = true;
            })
        })

        const h1 = document.createElement("h1");
        h1.innerHTML = "AHAHA NULLOS";
        root.appendChild(h1)
        timerOn = false;
        gameover = true;
        totalMine = 0;

    }

}

const w = 30;
const canvasWidth = 400;
const canvasHeight = 400;

let totalMine = 0;
let timerOn = false;
let gameover = true;
let grid = new Grid(Math.floor(canvasWidth / w), Math.floor(canvasHeight / w), w);;

const root = document.getElementById("root")
const canvas = document.createElement("canvas")
const score = document.getElementById("points")
const time = document.getElementById("time")

canvas.width = canvasWidth;
canvas.height = canvasHeight;
root.appendChild(canvas);
const ctx = canvas.getContext("2d");


const fillText = (cell, style) => {
    ctx.beginPath()
    if (style) {
        ctx.fillStyle = style;
    } else {
        ctx.fillStyle = "#FFF";
    }
    ctx.fillText(cell.neighborCount, cell.x + cell.w / 2 - 2, cell.y + cell.w / 2 + 2);
    ctx.fill();
    ctx.closePath();
}
const rectS = (x, y, w, style) => {
    ctx.beginPath()
    if (style) {
        ctx.strokeStyle = style;
    } else {
        ctx.strokeStyle = "#F00";
    }
    ctx.rect(x, y, w, w);
    ctx.stroke()
    ctx.closePath();
}
const rectF = (x, y, w, style) => {
    ctx.beginPath()
    if (style) {
        ctx.fillStyle = style;
    } else {
        ctx.fillStyle = "#F00";
    }
    ctx.rect(x, y, w, w);
    ctx.fill()
    ctx.closePath();
}
const elipseS = (x, y, w, style) => {
    ctx.beginPath()
    if (style) {
        ctx.strokeStyle = style;
    } else {
        ctx.strokeStyle = "#F00";
    }
    ctx.arc(x + w / 2, y + w / 2, w / 4, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath()
}
const elipseF = (x, y, w, style) => {
    ctx.beginPath()
    if (style) {
        ctx.fillStyle = style;
    } else {
        ctx.fillStyle = "#F00";
    }
    ctx.arc(x + w / 2, y + w / 2, w / 4, 0, 2 * Math.PI, false);
    ctx.fill()
    ctx.closePath()
}


canvas.addEventListener('mousedown', event => {
    if(!gameover) {
        timerOn = true;
        const cell = grid.reveal(event.offsetX, event.offsetY);
        
        if (cell?.mine) {
            grid.endgame();
            grid.render();
            
        } else {
            grid.render();
            score.innerText = totalMine;
        }
    } else {
        grid = new Grid(Math.floor(canvasWidth / w), Math.floor(canvasHeight / w), w);
        timerOn = true;
        gameover = false;

        time.innerText = 0;
        grid.render();

        const intervalId = setInterval(() => {
            if(timerOn) {
                time.innerText++
            }
            if(gameover) {
                clearInterval(intervalId)
            }
        }, 1000)
        
    }


})
