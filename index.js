const snakeGame = (function () {
  function snakeGame(MapSize = []) {
    this.init();
    this.MapCol = MapSize[1] || 20;
    this.MapRow = MapSize[2] || 20;
  }

  snakeGame.prototype.init = function () {
    initConfig();
    const MapRow = Array.from({ length: this.MapCol }, () => 0);
    this.MapList = Array.from({ length: this.MapRow }, () => MapRow);
    this.SnakePosition = [];
  };

  snakeGame.prototype.start = function () {};

  snakeGame.prototype.refreshMap = function () {};

  snakeGame.prototype.showMap = function () {
    let result = "";
    for (let row = 0; row < this.MapList.length; row++) {
      const rowElement = this.MapList[row];
      result += rowElement.join("");
      result += "\n";
    }
    console.log(result);
  };

  snakeGame.prototype.interval = function (callBack) {
    initListen();
    initWorker();
    function initListen() {
      window.addEventListener("keydown", function (e) {
        console.log(e);
      });
    }

    function initWorker() {
      if (window.Worker) {
        const myWorker = new Worker("worker.js");

        myWorker.onmessage = function () {
          MapList;
          console.log(first.value);
          myWorker.postMessage({ start: true, times: 1000 });
        };
        myWorker.postMessage({ start: true, times: 1000 });
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    }
  };
  return snakeGame;
})();

const test = new snakeGame();
