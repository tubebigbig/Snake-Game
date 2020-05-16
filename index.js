const gameMapEle = document.getElementById("gameMap");
const scoreCountEle = document.getElementById("scoreCount");
const levelCountEle = document.getElementById("levelCount");
const hScoreCountEle = document.getElementById("hScoreCount");
const LevelControllEle = document.getElementById("LevelControll");
const gameOverEle = document.getElementsByClassName("gameOver");
const gameStartEle = document.getElementsByClassName("gameStart");

let LevelControll = 0;
const snakeGame = (function () {
  /**# mapRule
   * 0 equal road
   * 1 equal wall
   * 2 equal food
   * 3 equal snake
   *
   * # direction
   * 0 up
   * 1 right
   * 2 down
   * 3 left
   */
  let eatFootCount = 0;
  let tempDirection;
  let tempMapSize;
  let tempScore = 0;
  let tempLevel = 0;
  let temphScore = localStorage.getItem("heightScore") || 0;
  function snakeGame(MapSize = []) {
    tempMapSize = MapSize;
    this.init(MapSize);
    this.initMap();
    this.showMap();
  }

  snakeGame.prototype.init = function (MapSize) {
    this.MapColLen = MapSize[1] || 20;
    this.MapRowLen = MapSize[2] || 20;
    this.MapList = [];
    this.speed = 900;
    this.direction = Math.floor(Math.random() * 5);
    this.SnakePosition = [];
    this.foodLocation = [];
    scoreCountEle.textContent = 0;
    levelCountEle.textContent = 0;
    tempScore = 0;
    tempLevel = 0;
    eatFootCount = 0;
    tempDirection = undefined;
    console.log("config", {
      "this.direction": this.direction,
      "this.MapColLen": this.MapColLen,
      "this.MapRowLen": this.MapRowLen,
    });
    hScoreCountEle.textContent = temphScore;
    console.log("direction", this.direction);
  };

  snakeGame.prototype.initMap = function () {
    const MapCol = [];
    for (let i = 0; i < this.MapRowLen; i++) {
      const MapRow = [];
      for (let k = 0; k < this.MapColLen; k++) {
        if (
          i === 0 ||
          i === this.MapRowLen - 1 ||
          k === 0 ||
          k === this.MapColLen - 1
        )
          MapRow.push(1);
        else MapRow.push(0);
      }
      MapCol.push(MapRow);
    }
    this.MapList = MapCol;
  };

  snakeGame.prototype.start = function () {
    this.speed = 900 - LevelControll * 100;
    tempLevel = LevelControll;
    levelCountEle.textContent = tempLevel;
    gameStartEle[0].classList.add("displayNone");
    gameOverEle[0].classList.add("displayNone");
    this.interval();
  };

  snakeGame.prototype.reStart = function () {
    gameStartEle[0].classList.remove("displayNone");
    gameOverEle[0].classList.add("displayNone");
    this.init(tempMapSize);
    this.initMap();
    // this.interval();
  };

  snakeGame.prototype.refreshMap = function () {
    if (!isNaN(parseInt(tempDirection, 10))) this.direction = tempDirection;
    if (this.SnakePosition.length > 0) {
      const SnakeHead = [...this.SnakePosition[this.SnakePosition.length - 1]];
      switch (this.direction) {
        case 0:
          SnakeHead[0]++;
          this.SnakePosition.push(SnakeHead);
          break;
        case 1:
          SnakeHead[1]++;
          this.SnakePosition.push(SnakeHead);
          break;
        case 2:
          SnakeHead[0]--;
          this.SnakePosition.push(SnakeHead);
          break;
        case 3:
          SnakeHead[1]--;
          this.SnakePosition.push(SnakeHead);
          break;
        default:
          SnakeHead[1]--;
          this.SnakePosition.push(SnakeHead);
          break;
      }
      const snakeHead = this.SnakePosition[this.SnakePosition.length - 1];
      if (
        this.foodLocation.length === 0 ||
        snakeHead[0] !== this.foodLocation[0] ||
        snakeHead[1] !== this.foodLocation[1]
      ) {
        this.SnakePosition.shift();
      } else {
        eatFootCount++;
        tempScore += 100;
        scoreCountEle.textContent = tempScore;
        if (eatFootCount >= 1 && this.speed > 100) {
          console.log("tempLevel", tempLevel);
          levelCountEle.textContent = tempLevel++;
          this.speed = this.speed - 100;
          eatFootCount = 0;
          console.log(this.speed);
        }
        this.foodLocation = [];
      }
    } else {
      this.initSnake();
    }
    this.initMap();
    for (let i = 0; i < this.SnakePosition.length; i++) {
      const [row, col] = this.SnakePosition[i];
      if (
        row < 1 ||
        col < 1 ||
        col >= this.MapColLen - 1 ||
        row >= this.MapRowLen - 1 ||
        this.MapList[row][col] === 1 ||
        this.MapList[row][col] === 3
      ) {
        return false;
      }
      this.MapList[row][col] = 3;
    }
    if (this.foodLocation.length > 0) {
      this.MapList[this.foodLocation[0]][this.foodLocation[1]] = 2;
    } else {
      do {
        this.foodLocation = [
          Math.floor(Math.random() * (this.MapRowLen - 2) + 1),
          Math.floor(Math.random() * (this.MapColLen - 2) + 1),
        ];
        console.log("food", [...this.foodLocation]);
      } while (this.MapList[this.foodLocation[0]][this.foodLocation[1]] !== 0);
      this.MapList[this.foodLocation[0]][this.foodLocation[1]] = 2;
    }
    return true;
  };

  snakeGame.prototype.initSnake = function () {
    const snakeTail = [
      Math.floor((Math.random() * this.MapRowLen) / 2) + this.MapRowLen / 4,
      Math.floor((Math.random() * this.MapColLen) / 2) + this.MapColLen / 4,
    ];
    let snakeHead = [...snakeTail];
    let snakeBody = [...snakeTail];
    switch (this.direction) {
      case 0:
        snakeBody[0]++;
        snakeHead[0] += 2;
        break;
      case 1:
        snakeBody[1]++;
        snakeHead[1] += 2;
        break;
      case 2:
        snakeBody[0]--;
        snakeHead[0] -= 2;
        break;
      case 3:
        snakeBody[1]--;
        snakeHead[1] -= 2;
        break;
      default:
        snakeBody[1]--;
        snakeHead[1] -= 2;
        break;
    }
    this.SnakePosition = [snakeTail, snakeBody, snakeHead];
  };

  snakeGame.prototype.showMap = function () {
    let result = "";
    gameMapEle.innerHTML = "";
    for (let row = 0; row < this.MapList.length; row++) {
      if (row === 0 || row === this.MapList.length - 1) continue;
      const rowElement = this.MapList[row];
      result += '<div class="row">';
      for (let k = 0; k < rowElement.length; k++) {
        const ColElement = rowElement[k];
        switch (ColElement) {
          case 0:
            result += '<div class="col road"></div>';
            break;
          case 2:
            result += '<div class="col food"></div>';
            break;
          case 3:
            result += '<div class="col snake"></div>';
            break;
        }
      }
      result += "</div>";
    }
    gameMapEle.innerHTML = result;
    // console.log(result);
  };

  snakeGame.prototype.interval = function (callBack) {
    const self = this;
    initListen();
    initWorker();
    function initListen() {
      window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
          case 37:
            if (self.direction === 1) return;
            tempDirection = 3;
            break;
          case 38:
            if (self.direction === 0) return;
            tempDirection = 2;
            break;
          case 39:
            if (self.direction === 3) return;
            tempDirection = 1;
            break;
          case 40:
            if (self.direction === 2) return;
            tempDirection = 0;
            break;
          default:
            break;
        }
      });
    }

    function initWorker() {
      if (window.Worker) {
        const myWorker = new Worker("worker.js");
        const intervalFunc = function () {
          const isSnakeAlive = self.refreshMap();
          if (isSnakeAlive) {
            self.showMap();
            myWorker.postMessage({ start: true, times: self.speed });
          } else {
            // self.showMap();
            gameOverEle[0].classList.remove("displayNone");
            if (tempScore > temphScore) {
              temphScore = tempScore;
              localStorage.setItem("heightScore", temphScore);
              hScoreCountEle.textContent = temphScore;
            }
            console.log("snake died");
            // myWorker.postMessage({ start: true, times: 1000 });
          }
        };
        myWorker.onmessage = intervalFunc;
        intervalFunc();
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    }
  };
  return snakeGame;
})();

// const test = new snakeGame();
const reduceLevel = function () {
  if (LevelControll <= 0) return;
  LevelControll--;
  LevelControllEle.textContent = LevelControll;
};

const plusLevel = function () {
  if (LevelControll >= 8) return;
  LevelControll++;
  LevelControllEle.textContent = LevelControll;
};
