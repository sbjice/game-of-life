class GameBoard {
  constructor(rows = 160, cols = 160, density = 0.35) {
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
    const row = Math.floor(idx / (this.rows + 1));
    if (col > 0) {
      if (row > 0) {
        return idx - this.cols - 1;
      } else {
        return this.cellsNumber + idx - 1 - this.cols;
      }
    } else {
      if (row > 0) {
        return idx - 1;
      } else {
        return this.cellsNumber - 1;
      }
    }
  }

  topRightCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / (this.rows + 1));
    if (col > this.cols - 2) {
      if (row < 1) {
        return this.cellsNumber - col - 1;
      } else {
        return idx - this.cols - col;
      }
    } else {
      if (row < 1) {
        return this.cellsNumber - this.cols + col + 1;
      } else {
        return idx - this.cols + 1;
      }
    }
  }

  btmLeftCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / (this.rows + 1));
    if (col > 0) {
      if (row < this.rows - 1) {
        return idx + this.cols - 1;
      } else {
        return col - 1;
      }
    } else {
      if (row < this.rows - 1) {
        return idx + 2 * this.cols - 1;
      } else {
        return this.cellsNumber - idx - 1;
      }
    }
  }

  btmRightCellIndex(idx) {
    const col = idx % this.cols;
    const row = Math.floor(idx / (this.rows + 1));
    if (col < this.cols - 1) {
      if (row < this.rows - 1) {
        return idx + this.cols + 1;
      } else {
        return col + 1;
      }
    } else {
      if (row < this.rows - 1) {
        return idx + 1;
      } else {
        return 0;
      }
    }
  }

  topMiddleCellIndex(idx) {
    const row = Math.floor(idx / (this.rows + 1));
    if (row > 0) {
      return idx - this.cols;
    } else {
      return this.cellsNumber - (this.cols - idx);
    }
  }

  btmMiddleCellIndex(idx) {
    const row = Math.floor(idx / (this.rows + 1));
    if (row < this.rows - 1) {
      return idx + this.cols;
    } else {
      return idx % this.cols;
    }
  }

  midLeftCellIndex(idx) {
    const col = idx % this.cols;
    if (col > 0) {
      return idx - 1;
    } else {
      return idx + this.cols - 1;
    }
  }

  midRightCellIndex(idx) {
    const col = idx % this.cols;
    if (col < this.cols - 1) {
      return idx + 1;
    } else {
      return idx - this.cols + 1;
    }
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
//   console.log(board.topLeftCellIndex(ind));
// });

// button.click();
// board.getMapForEachIndex();



// TODO
// + 1) хранение поля в строке
// + 2) генерация нового поколения на основе правил

//https://ru.wikipedia.org/wiki/%D0%98%D0%B3%D1%80%D0%B0_%C2%AB%D0%96%D0%B8%D0%B7%D0%BD%D1%8C%C2%BB#%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0
/*
Распределение живых клеток в начале игры называется первым поколением. 
Каждое следующее поколение рассчитывается на основе предыдущего по таким правилам:
  - в пустой (мёртвой) клетке, с которой соседствуют три живые клетки, зарождается жизнь;
  - если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить; в противном случае (если живых соседей меньше двух или больше трёх) клетка умирает («от одиночества» или «от перенаселённости»).

Игра прекращается, если:
  - на поле не останется ни одной «живой» клетки;
  - конфигурация на очередном шаге в точности (без сдвигов и поворотов) повторит себя же на одном из более ранних шагов (складывается периодическая конфигурация)
  - при очередном шаге ни одна из клеток не меняет своего состояния (частный случай предыдущего правила, складывается стабильная конфигурация)
*/

// + 3) обработка цикличного поля (верх - продолжение низа / лево - продолжение того что справа) 
// 4) выдача поля в формате объекта (строки, колонки, текущее поколение, число живых клеток, массив массивов с клетками)
// 5) отрисовка поля на канвасе