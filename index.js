class GameBoard {
  constructor(rows = 160, cols = 160, density = 0.45) {
    this.rows = rows;
    this.cols = cols;
    this.cellsNumber = this.rows * this.cols;
    this.generations = 0;
    this.aliveCell = ".";
    this.deadCell = " ";
    this.density = density;
    this.init();
  }

  init() {
    this.boardString = "";
    for (let i = 0; i < this.cellsNumber; i += 1) {
      this.boardString +=
        Math.random() > this.density ? this.aliveCell : this.deadCell;
    }
  }

  // joinArrayToString() {
  //   return this.startingArray.reduce((prevStr, curStr) => prevStr + curStr.join(''), '');
  // }

  printGameBoard() {
    let gameBoard = "";
    for (let i = 0; i < this.rows; i += 1) {
      gameBoard +=
        this.boardString.slice(i * this.cols, this.cols * (i + 1)) + "\n";
    }
    return gameBoard;
  }

  topLeftCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / this.cols);
    return col > 0 
      ? row > 0 ? idx - this.cols - 1 : this.cellsNumber + idx - 1 - this.cols
      : row > 0 ? idx - 1 : this.cellsNumber - 1;
  }

  topRightCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / this.cols);
    return col > this.cols - 2
      ? row < 1 ? this.cellsNumber - col - 1 : idx - this.cols - col
      : row < 1 ? this.cellsNumber - this.cols + col + 1 : idx - this.cols + 1;
  }

  btmLeftCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / this.cols);
    return col > 0 
      ? row < this.rows - 1 ? idx + this.cols - 1 : col - 1
      : row < this.rows - 1 ? idx + 2 * this.cols - 1 : this.cellsNumber - idx - 1;
  }

  btmRightCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / this.cols);
    return col < this.cols - 1
      ? row < this.rows - 1 ? idx + this.cols + 1 : col + 1
      : row < this.rows - 1 ? idx + 1 : 0;
  }

  topMiddleCellIndex(idx) {
    const row = Math.floor(idx / this.cols);
    return row > 0 
      ? idx - this.cols
      : this.cellsNumber - (this.cols - idx);
  }

  btmMiddleCellIndex(idx) {
    const row = Math.floor(idx / this.cols);
    return row < this.rows - 1 
      ? idx + this.cols
      : idx % this.cols;
  }

  midLeftCellIndex(idx) {
    const col = idx % this.cols;
    return col > 0
      ? idx - 1 
      : idx + this.cols - 1;
  }

  midRightCellIndex(idx) {
    const col = idx % this.cols;
    return col < this.cols - 1
      ? idx + 1
      : idx - this.cols + 1;
  }

  updateBoard() {
    this.boardString = this.boardString
      .split("")
      .map((val, ind, arr) => {
        let indexes = [
          this.topLeftCellIndex(ind),
          this.topMiddleCellIndex(ind),
          this.topRightCellIndex(ind),
          this.midLeftCellIndex(ind),
          ind,
          this.midRightCellIndex(ind),
          this.btmLeftCellIndex(ind),
          this.btmMiddleCellIndex(ind),
          this.btmRightCellIndex(ind),
        ];

        const neighbors = this.countNeighbors(indexes, ind);

        //b3 / s23
        if (this.boardString[ind] === this.deadCell) {
          return neighbors === 3 ? this.aliveCell : this.deadCell; // b3 - ===3; b3+ - >=3
        } else {
          return neighbors < 2 || neighbors > 3 // s23 - neighbors === 2 || neighbors === 3
            ? this.deadCell
            : this.aliveCell;
        }
      })
      .join("");
    this.generations += 1;
  }

  countNeighbors(arr, idx) {
    let neighbors = 0;
    for (let i of arr) {
      if (i !== idx) {
        if (this.boardString[i] === this.aliveCell) neighbors += 1;
      }
    }
    return neighbors;
  }

  getMapForEachIndex() {
    this.boardString.split("").forEach((val, ind, arr) => {

      let indexes = [
        this.topLeftCellIndex(ind),
        this.topMiddleCellIndex(ind),
        this.topRightCellIndex(ind),
        this.midLeftCellIndex(ind),
        ind,
        this.midRightCellIndex(ind),
        this.btmLeftCellIndex(ind),
        this.btmMiddleCellIndex(ind),
        this.btmRightCellIndex(ind),
      ];
      console.log(indexes, "\n");
    });
  }

  composeMapForIndex(ind) {
    let indexes = [
      this.topLeftCellIndex(ind),
      this.topMiddleCellIndex(ind),
      this.topRightCellIndex(ind),
      this.midLeftCellIndex(ind),
      ind,
      this.midRightCellIndex(ind),
      this.btmLeftCellIndex(ind),
      this.btmMiddleCellIndex(ind),
      this.btmRightCellIndex(ind),
    ];
    return indexes;
  }
}


const button = document.createElement("button");
button.textContent = "Start/Pause";
button.style.marginBottom = "10px";
document.body.append(button);
const board = new GameBoard();

const createDomGrid = (board) => {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  const rows = board.rows;
  const cols = board.cols;
  for (let i = 0; i < rows; i += 1) {
    const gridRow = document.createElement("div");
    gridRow.classList.add("grid-row");
    for (let j = 0; j < cols; j += 1) {
      const gridCell = document.createElement("div");
      gridCell.classList.add("grid-cell");
      gridCell.classList.add(board.boardString[i * cols + j] === board.aliveCell ? "grid-cell__alive" : "grid-cell__dead");
      // const indexes = board.composeMapForIndex(i * cols + j);
      // const ind = indexes.slice(0,3) + '\n' + indexes.slice(3, 6) + '\n' + indexes.slice(6, 9);
      // gridCell.textContent = ind;
      gridRow.append(gridCell);
    }
    grid.append(gridRow);
  }
  return grid;
};

const updateDomGrid = (board) => {
  let grid = document.getElementsByClassName('grid');
  grid = grid[0];
  const rows = board.rows;
  const cols = board.cols;
  for (let i = 0; i < rows; i += 1) {
    const gridRow = grid.children[i];
    for (let j = 0; j < cols; j += 1) {
      const gridCell = gridRow.children[j];
      gridCell.classList.remove("grid-cell__alive", "grid-cell__dead");
      gridCell.classList.add(board.boardString[i * cols + j] === board.aliveCell ? "grid-cell__alive" : "grid-cell__dead");
    }
  }
};


const gridContainer = document.createElement("div");
document.body.append(gridContainer);

const grid = createDomGrid(board);
gridContainer.append(grid);

const genText = document.createElement("p");
genText.textContent = "current generation: " + board.generations;

gridContainer.append(genText);

let intId = 0;
button.addEventListener("click", (event) => {
  if (intId !== 0) {
    clearInterval(intId);
    intId = 0;
  } else {
    intId = setInterval(() => {
      board.updateBoard();
      updateDomGrid(board);
      genText.textContent = "current generation: " + board.generations;
    }, 300);
  }
});

// const indexes = board.composeMapForIndex(3);
// console.log(indexes);
// for (let i = 0; i < board.boardString.length; i += 1) {
//   const indexes = board.composeMapForIndex(i);
//   console.log(indexes);
// }

// board.boardString.split("").forEach((val, ind, arr) => {
//   console.log(board.btmLeftCellIndex(ind));
// });

// button.click();
// board.getMapForEachIndex();




// TODO: выдача поля в формате объекта (строки, колонки, текущее поколение, число живых клеток, массив массивов с клетками)
// TODO: отрисовка поля на канвасе