const width = 10;
const grid = document.querySelector(".grid");
/* creating an array of all square divs using Array.from() method */
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");

let nextRandom = 0;
let timerID = null;
let score = 0;

// The Tetriminoes.
/*Each tetrimino is an array of 4 arrays indicating the
indices of all of its 4 orientations*/
const lTetrimino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetrimino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetrimino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetrimino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetrimino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetriminoes = [
  lTetrimino,
  zTetrimino,
  tTetrimino,
  oTetrimino,
  iTetrimino,
];

// The current tetrimino and its position

let currentPosition = 4;
let currentRotation = 0;
//randomly selecting a tetrimino and its 1st rotation
let random = Math.floor(Math.random() * theTetriminoes.length);
let currentTetrimino = theTetriminoes[random][currentRotation]; //L-shaped's 1st rotation

//draw the tetrimino
function draw() {
  currentTetrimino.forEach((index) => {
    squares[currentPosition + index].classList.add("tetrimino");
  });
}

//undraw the tetrimino
function undraw() {
  currentTetrimino.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetrimino");
  });
}

//Making the tetrimino move down every second
// let timerID = setInterval(moveDown, 1000);

//assigning functions to keycodes
function control(event) {
  if (event.keyCode === 37) {
    moveLeft();
  } else if (event.keyCode === 38) {
    rotate();
  } else if (event.keyCode === 39) {
    moveRight();
  } else if (event.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener("keydown", control);

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if (
    currentTetrimino.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    currentTetrimino.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    //start a new tetrimino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetriminoes.length);
    currentTetrimino = theTetriminoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move tetrimino left unless its at the edge or there is a blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = currentTetrimino.some(
    (index) => (currentPosition + index) % width === 0
  ); //The indices of the left edge of the grid are-0,10,20,..

  //if we are not at the left edge
  if (!isAtLeftEdge) {
    currentPosition -= 1;
  }

  //if we hit another tetrimino
  if (
    currentTetrimino.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

//move tetrimino right unless its at the edge or there is a blockage
function moveRight() {
  undraw();
  const isAtRightEdge = currentTetrimino.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  //if we are not at the right edge
  if (!isAtRightEdge) {
    currentPosition += 1;
  }

  //if we hit another tetrimino
  if (
    currentTetrimino.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

//rotate the tetrimino
function rotate() {
  undraw();
  currentRotation++;

  //if the current rotation goes to 4, go back to zero
  if (currentRotation === currentTetrimino.length) {
    currentRotation = 0;
  }
  //draw the new tetrimino
  currentTetrimino = theTetriminoes[random][currentRotation];
  draw();
}

//show up-next tetrimino in the mini-grid
const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

//the Tetriminoes without rotations
const upNextTetriminoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetrimino first rotation
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetrimino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetrimino
  [0, 1, displayWidth, displayWidth + 1], //oTetrimino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetrimino
];

//display the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetrimino from the entire grid
  displaySquares.forEach((square) => {
    square.classList.remove("tetrimino");
  });

  upNextTetriminoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("tetrimino");
  });
}

//adding functionality to the start/pause button
startBtn.addEventListener("click", () => {
  if (timerID !== null) {
    clearInterval(timerID);
    timerID = null;
  } else {
    draw();
    timerID = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * theTetriminoes.length);
    displayShape();
  }
});

//add score
function addScore() {
  for (let i = 0; i < 199; i++) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];
    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetrimino");
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

//game over function
function gameOver() {
  if (
    currentTetrimino.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    scoreDisplay.innerHTML = "end";
    clearInterval(timerID);
  }
}
