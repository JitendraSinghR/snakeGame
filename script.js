// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
let scoreElement = document.getElementById("score");
let hiScoreElement = document.getElementById("hiscore");

let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 3, y: 5 }];

//Process of adding speed
let speed = 4;
const speedSelect = document.getElementById("speed-select");
const speedDisplay = document.getElementById("speed-display");

speedSelect.addEventListener("change", () => {
  speed = parseInt(speedSelect.value);
  speedDisplay.textContent = `Speed: ${speed}`;
});


function showCustomAlert() {
  const customAlert = document.getElementById('customAlert');
  customAlert.style.display = 'block';
}

function closeCustomAlert() {
  const customAlert = document.getElementById('customAlert');
  customAlert.style.display = 'none';
}


food = { x: 7, y: 9 };

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If you bump into the wall
  if (
    snake[0].x >= 30 ||
    snake[0].x <= 0 ||
    snake[0].y >= 30 ||
    snake[0].y <= 0
  ) {
    return true;
  }

  return false;
}

function gameEngine() {
  // Part 1: Updating the snake array & Food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
  
    showCustomAlert()
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.play();
    scoreElement.innerHTML = "Score: 0";
    score = 0;
  }

  // If you have eaten the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiScoreElement.innerHTML = "HiScore: " + hiscoreval;
    }
    scoreElement.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
    // The use of the spread (...) operator creates a shallow copy of the object, preventing them from referencing the same object in memory.
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Display the snake and Food
  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  // Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Main logic
musicSound.play();
let hiScore = localStorage.getItem("hiscore");
console.log(hiScore);
if (hiScore === null) {
  hiscoreval = 0;
  localStorage.setItem("HiScore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiScore);
  hiScoreElement.innerHTML = "HiScore: " + hiscoreval;
}

window.requestAnimationFrame(main);

let previousDirection = "";
let previousKey = "";
window.addEventListener("keydown", (e) => {
  const currentKey = e.key;
  if (currentKey !== previousKey) {
    let newDirection;
    switch (currentKey) {
      case "ArrowUp":
        newDirection = "up";
        break;
      case "ArrowDown":
        newDirection = "down";
        break;
      case "ArrowLeft":
        newDirection = "left";
        break;
      case "ArrowRight":
        newDirection = "right";
        break;
      default:
        break;
    }

    if (!isOppositeDirection(newDirection, previousDirection)) {
      inputDir = getDirection(newDirection);
      moveSound.play();
      previousDirection = newDirection;
    }
  }
});

function isOppositeDirection(dir1, dir2) {
  return (
    (dir1 === "up" && dir2 === "down") ||
    (dir1 === "down" && dir2 === "up") ||
    (dir1 === "left" && dir2 === "right") ||
    (dir1 === "right" && dir2 === "left")
  );
}

function getDirection(dir) {
  switch (dir) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}
