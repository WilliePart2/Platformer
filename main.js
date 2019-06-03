// var width = window.innerWidth;
// https://github.com/WilliePart2/Platformer.git

var GameArea = (function() {

  var _instance = null;
  return {
    getInstance: function() {
      if (!_instance) {
        _instance = new Area();
      }

      return _instance;
    }
  };

  function Area() {
    this.width = document.body.offsetWidth;
    this.height = document.body.offsetHeight;
  }
})();

function BaseElement(x, y, width, height) {
  var elt = document.createElement('div');
  elt.setAttribute('style', 'position: absolute; left:' + x + 'px; top:' + y + 'px; width:' + width + 'px; height:' + height + 'px; background: black;');
  document.body.appendChild(elt);

  this.step = 10;
  this.xVector = 1;
  this.yVector = 1;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.element = elt;

  this.getNextPosition = function() {
    let styles = this.element.style;
    return {
      x: parseInt(styles.left, 10) + this.step * this.xVector,
      y: parseInt(styles.top, 10) + this.step * this.yVector
    };
  };

  this.makeXStep = function() {
    this.x = this.getNextPosition().x;
    this.element.style.left = this.x + 'px';
  };

  this.makeYStep = function() {
    this.y = this.getNextPosition().y;
    this.element.style.top = this.y + 'px';
  };

  this.changeXDirection = function () {
    this.xVector *= -1;
  };

  this.changeYDirection = function () {
    this.yVector *= -1;
  }
}

function GameElement(x, y, width, height) {
  BaseElement.call(this, x, y, width, height);

  this.makeStep = function () {
    this.makeXStep();
    this.makeYStep();
  };

  this.changeDirection = function () {
    this.changeXDirection();
    this.changeYDirection();
  }
}

function PlatformElement() {
  var area = GameArea.getInstance();
  var width = 200;
  var maxPoint = area.width - width;
  var minPoint = 0;
  var height = 20;
  var LEFT_KEY = 37;
  var RIGHT_KEY = 39;
  BaseElement.call(this, 10, area.height - height, width, height);
  this.step = 50;
  this.needToMakeStep = false;

  this.onKeyDown = function (event) {
    var key = event.which || event.keyCode;

    if (key === LEFT_KEY || key === RIGHT_KEY) {
      this.xVector = key === LEFT_KEY ? -1 : 1;
      var nextPosition = this.getNextPosition().x;
      if (nextPosition >= minPoint && nextPosition <= maxPoint) {
        this.needToMakeStep = true;
      }
    }
  };

  this.makeStep = function() {
    if (this.needToMakeStep) {
      this.makeXStep();
      this.needToMakeStep = false;
    }
  };

  window.addEventListener('keydown', this.onKeyDown.bind(this), false);
}

window.onload = function() {
  var gameElement = new GameElement(10, 10, 100, 100);
  var platform = new PlatformElement();
  var area = GameArea.getInstance();

  let game = requestAnimationFrame(gameLoop);
  function gameLoop() {
    gameElement.makeStep();
    platform.makeStep();
    var maxXPoint = area.width - gameElement.width;
    var minXPoint = 0;
    var maxYPoint = area.height;
    var minYPoint = 0;
    var platformStart = platform.x;
    var platformEnd = platform.x + platform.width;

    if (gameElement.x <= minXPoint) {
      gameElement.changeXDirection();
    }

    if (gameElement.x >= maxXPoint) {
      gameElement.changeXDirection();
    }

    var gameElementYEnd = gameElement.y + gameElement.height;
    let isGameElementOnPlatform = (platformStart >= gameElement.x && platformStart <= gameElement.width) || (platformEnd >= gameElement.x && platformStart <= (gameElement.x + gameElement.width));
    let isNotLowerLastPoint = (gameElementYEnd) > platform.y && gameElementYEnd < maxYPoint;
    if (isGameElementOnPlatform && isNotLowerLastPoint) {
      gameElement.changeYDirection();
    } else if (gameElement.y >= maxYPoint) {
      cancelAnimationFrame(game);
      return;
    }

    if (gameElement.y <= minYPoint) {
      gameElement.changeYDirection();
    }

    game = requestAnimationFrame(gameLoop);
  }
};
