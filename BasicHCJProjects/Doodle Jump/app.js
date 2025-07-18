const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
doodler.style.left = doodlerLeftSpace + "px";
doodler.style.bottom = doodlerBottomSpace + "px";
let isGameOver = false;
let platformCount = 5;
let platforms = []; //an array of platforms to manipulate and function them as we need
let upTimerId;
let downTimerId;
let isJumping = false;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

//class Platform
class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * 315; //grid-width = 400 and platform width = 85 therefore
    //400-85 = 315 and thats why any random number between 0-315 will include our platform in the grid
    this.visual = document.createElement("div"); //create a div for each platform
    const visual = this.visual;
    grid.appendChild(visual); //works the same as jQuery append method,check it out
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
  }
}

//function to create platforms
function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platGap = 600 / platformCount; //the space/gap between the platforms vertically and 600=height of the grid
    let newPlatBottom = 100 + i * platGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
    console.log(platforms);
  }
}

//function to create the doodler
function createDoodler() {
  grid.appendChild(doodler);
  doodler.classList.add("doodler");
  doodlerLeftSpace = platforms[0].left; //it's left will always be equal to the left of the first platform
  doodler.style.left = doodlerLeftSpace + "px";
  doodler.style.bottom = doodlerBottomSpace + "px";
}

//function to move the platforms
function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    //move the platforms
    platforms.forEach((platform) => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove("platform"); //hides visibility of that platform
        platforms.shift(); //removes the first element from the array
        score++;

        //adding a new platform everytime we remove one platform
        let newPlatform = new Platform(600); //600 is the height of our grid
        //so that means the new platform will appear on top of our grid
        platforms.push(newPlatform);
      }
    });
  }
}

//function to fall
function fall() {
  clearInterval(upTimerId);
  isJumping = false;
  downTimerId = setInterval(function () {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if (doodlerBottomSpace <= 0) {
      gameOver();
    }
    //checking for collision between the doodler and the platform
    platforms.forEach((platform) => {
      if (
        doodlerBottomSpace >= platform.bottom &&
        doodlerBottomSpace <= platform.bottom + 15 &&
        doodlerLeftSpace + 60 >= platform.left &&
        doodlerLeftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        //15 - height of platform
        //60 - width of doodler
        //85 - width of platform
        console.log("landed");
        startPoint = doodlerBottomSpace;
        jump();
      }
    });
  }, 30);
}

function gameOver() {
  console.log("Game over");
  isGameOver = true;
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = score;
  clearInterval(downTimerId);
  clearInterval(upTimerId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
  alert("Game Over!");
}

//function to jump
function jump() {
  clearInterval(downTimerId);
  isJumping = true;
  upTimerId = setInterval(function () {
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if (doodlerBottomSpace > startPoint + 200) {
      fall();
    }
  }, 30);
}

//function to move left
function moveLeft() {
  if (isGoingRight) {
    clearInterval(rightTimerId);
    isGoingRight = false;
  }
  isGoingLeft = true;
  leftTimerId = setInterval(function () {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else {
      moveRight();
    }
  }, 50);
}

//function to move right
function moveRight() {
  if (isGoingLeft) {
    clearInterval(leftTimerId);
    isGoingLeft = false;
  }
  isGoingRight = true;
  rightTimerId = setInterval(function () {
    if (doodlerLeftSpace <= 340) {
      //400 - width of the grid
      //60 - width of the doodler
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else {
      moveLeft();
    }
  }, 50);
}

//function to move straight
function moveStraight() {
  isGoingLeft = false;
  isGoingRight = false;
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}

//function for keypresses
function control(e) {
  if (e.key === "ArrowLeft") {
    //move left
    moveLeft();
  }
  if (e.key === "ArrowRight") {
    //move right
    moveRight();
  }
  if (e.key === "ArrowUp") {
    //moveStraight
    moveStraight();
  }
}

function start() {
  if (!isGameOver) {
    //game starts here
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 50);
    jump();
    document.addEventListener("keydown", control);
  }
}
start();
