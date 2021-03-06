import entities.shapes.Rect as Rect;

/** @lends Camera */
exports = Class(Rect, function(supr) {

  /** @var {number} Camera._MAX_SIZE
      @private */
  this._MAX_SIZE = 32767;

  /**
   * Origin at top left, all numbers are in world positions, not screen positions
   * @constructs
   * @extends Rect
   */
  this.init = function(width, height) {
    // Must first define the walls, because of Camera's custom setters on x and y
    /** @type number
        @private */
    this._x = 0;
    /** @type number
        @private */
    this._y = 0;
    /** @type number
        @private */
    this._prevX = 0;
    /** @type number
        @private */
    this._prevY = 0;

    /**
     * @type object
     * @property {object} left
     * @property {object} top
     * @property {object} right
     * @property {object} bottom
     */
    this.wallOffsets = {
      left:   { x: 0, y: 0 },
      top:    { x: 0, y: 0 },
      right:  { x: 0, y: 0 },
      bottom: { x: 0, y: 0 }
    };

    var wallOpts = { width: this._MAX_SIZE, height: this._MAX_SIZE };
    /** A collidable element representing the entire space left of the camera.
        @type Rect */
    this.leftWall = new Rect(wallOpts);
    this.leftWall.fixed = true;
    this.leftWall.wallName = 'left';
    /** A collidable element representing the entire space right of the camera.
        @type Rect */
    this.rightWall = new Rect(wallOpts);
    this.rightWall.fixed = true;
    this.rightWall.wallName = 'right';
    /** A collidable element representing the entire space above the camera.
        @type Rect */
    this.topWall = new Rect(wallOpts);
    this.topWall.fixed = true;
    this.topWall.wallName = 'top';
    /** A collidable element representing the entire space below the camera.
        @type Rect */
    this.bottomWall = new Rect(wallOpts);
    this.bottomWall.fixed = true;
    this.bottomWall.wallName = 'bottom';

    /** An array of all the walls for easy reference.
        @type Rect[]
        @readonly */
    this.walls = [this.leftWall, this.rightWall, this.topWall, this.bottomWall];

    // Now initilize super
    var suprOpts = {
      width: width,
      height: height
    };
    supr(this, 'init', [suprOpts]);

    /** The camera will keep this {@link Actor} inside of the {@link Camera#movementBounds}
        @type Actor */
    this.following = null;
    /** The camera will keep the {@link Camera#following} inside of this {@link Shape} when set.
        @type Shape */
    this.movementBounds = null;

    this.resize(width, height);
  };

  /**
   * Update the camera with a new width and height
   * @param  {number} width
   * @param  {number} height
   */
  this.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.wallOffsets.left.x = -this._MAX_SIZE;
    this.wallOffsets.left.y = -this._MAX_SIZE / 2;

    this.wallOffsets.top.x = -this._MAX_SIZE / 2;
    this.wallOffsets.top.y = -this._MAX_SIZE;

    this.wallOffsets.right.x = width;
    this.wallOffsets.right.y = -this._MAX_SIZE / 2;

    this.wallOffsets.bottom.x = -this._MAX_SIZE / 2;
    this.wallOffsets.bottom.y = height;

    // Trigger the setters to update wall positions
    this.x = this.x;
    this.y = this.y;
  };

  /**
   * Set the target for the camera to follow
   * @param {Actor} target This is the actor the camera will try to follow
   * @param {Rect}  [movementBounds] The camera will keep the actor within these screen bounds
   */
  this.follow = function(target, movementBounds) {
    // define default movementBounds based on background scrolling
    if (!movementBounds) {
      var bgConfig = scene.background.config;
      var scrollX = false;
      var scrollY = false;
      for (var i = 0; i < bgConfig.length; i++) {
        scrollX = bgConfig[i].xCanSpawn || scrollX;
        scrollY = bgConfig[i].yCanSpawn || scrollY;
      }

      movementBounds = new Rect({
        x: scrollX ? this._x + this.width / 2 : 0,
        y: scrollY ? this._y + this.height / 2 : 0,
        width: scrollX ? 0 : this.width,
        height: scrollY ? 0 : this.height
      });
    }

    this.following = target;
    this.movementBounds = movementBounds;
  };

  /**
   * Stop the camera from following an actor
   */
  this.stopFollowing = function() {
    this.following = null;
  };

  /**
   * Remove the current {@link Camera#movementBounds}
   */
  this.clearMovementBounds = function() {
    this.movementBounds = null;
  }

  /** @var {number} Camera#x */
  /** @var {number} Camera#y */
  /**
   * Delta position since last tick
   * @var {number} Camera#deltaX
   * @readonly
   */
  /**
   * Delta position since last tick
   * @var {number} Camera#deltaY
   * @readonly
   */
  Object.defineProperties(this, {
    x: {
      enumerable: true,
      get: function() { return this._x; },
      set: function(value) {
        this._x = value;

        this.leftWall.x = this.wallOffsets.left.x + value;
        this.rightWall.x = this.wallOffsets.right.x + value;
        this.topWall.x = this.wallOffsets.top.x + value;
        this.bottomWall.x = this.wallOffsets.bottom.x + value;
      }
    },
    y: {
      enumerable: true,
      get: function() { return this._y; },
      set: function(value) {
        this._y = value;

        this.leftWall.y = this.wallOffsets.left.y + value;
        this.rightWall.y = this.wallOffsets.right.y + value;
        this.topWall.y = this.wallOffsets.top.y + value;
        this.bottomWall.y = this.wallOffsets.bottom.y + value;
      }
    },
    deltaX: {
      enumerable: true,
      get: function() { return this._x - this._prevX; }
    },
    deltaY: {
      enumerable: true,
      get: function() { return this._y - this._prevY; }
    }
  });

  /**
   * Return a point which has been translated to world coordinates
   * @param  {Point} pt
   * @return {Point} worldPt
   */
  this.screenToWorld = function(pt) {
    return {
      x: pt.x + this.x,
      y: pt.y + this.y
    };
  };

  /**
   * @param {number} dt Time in milliseconds
   */
  this.update = function(dt) {
    this._prevX = this._x;
    this._prevY = this._y;

    if (!this.following) { return; }

    if (!this.following.active) {
      this.stopFollowing();
      return;
    }

    var x = this.following.x - this._x;
    var y = this.following.y - this._y;

    if (x < this.movementBounds.x) {
      this.x = this.following.x - this.movementBounds.x;
    } else if (x > this.movementBounds.right) {
      this.x = this.following.x - this.movementBounds.right;
    }

    if (y < this.movementBounds.y) {
      this.y = this.following.y - this.movementBounds.y;
    } else if (y > this.movementBounds.bottom) {
      this.y = this.following.y - this.movementBounds.bottom;
    }
  };

  /**
   * Whether or not the camera position has moved since last tick
   * @return {boolean}
   */
  this.hasChanged = function() {
    return this._prevX !== this._x || this._prevY !== this._y;
  };

  /**
   * Handle some sort of check and update on an actor, based on the camera and actor positions.
   * @typedef {function} cameraUpdateFunction
   * @this Scene.camera
   * @arg {Actor} actor
   * @returns {boolean} shouldUpdateView
   */

  /**
   * Determines which wall was hit, and inverts the actors velocity in the respective axis.
   * One argument must be a {@link Wall} and one must be an {@link Actor}.
   * @type cameraUpdateFunction
   */
  this.bounce = function(actor) {
    var flagX = this.bounceX(actor);
    var flagY = this.bounceY(actor);
    return flagX || flagY;
  };
  /** {@link Camera#bounce} in only the x direction */
  this.bounceX = function(actor) {
    if (actor.viewMaxX >= this.right || actor.viewMinX <= this.left) {
      actor.vx *= -1;
      return true;
    }
    return false;
  };
  /** {@link Camera#bounce} in only the y direction */
  this.bounceY = function(actor) {
    if (actor.viewMaxY >= this.bottom || actor.viewMinY <= this.top) {
      actor.vy *= -1;
      return true;
    }
    return false;
  };

  /**
   * Determines which wall was hit, and wraps the actor around to the other side of the screen.
   * One argument must be a {@link Wall} and one must be an {@link Actor}.
   * @type cameraUpdateFunction
   */
  this.wrap = function(actor) {
    var flagX = this.wrapX(actor);
    var flagY = this.wrapY(actor);
    return flagX || flagY;
  };
  /** {@link Camera#wrap} in only the x direction */
  this.wrapX = function(actor) {
    if (actor.viewMinX > this.right) {
      actor.x = this.left - actor.view.style.offsetX - actor.getViewWidth();
      return true;
    } else if (actor.viewMaxX < this.x) {
      actor.x = this.right - actor.view.style.offsetX;
      return true;
    }
    return false;
  };
  /** {@link Camera#wrap} in only the y direction */
  this.wrapY = function(actor) {
    if (actor.viewMinY > this.bottom) {
      actor.y = this.top - actor.view.style.offsetY - actor.getViewHeight();
      return true;
    } else if (actor.viewMaxY < this.top) {
      actor.y = this.bottom - actor.view.style.offsetY;
      return true;
    }
    return false;
  };

  /**
   * Keeps the actor completely in the view of the camera.
   * @type cameraUpdateFunction
   */
  this.fullyOn = function(actor) {
    var flagX = this.fullyOnX(actor);
    var flagY = this.fullyOnY(actor);
    return flagX || flagY;
  };
  /** {@link Camera#fullyOn} in only the x direction */
  this.fullyOnX = function(actor) {
    var actorLeft = actor.viewMinX;
    var thisLeft = this.x;
    if (actorLeft < thisLeft) {
      var dx = thisLeft - actorLeft;
      actor.x += dx;
      actor.prevX += dx;
      return true;
    }

    var actorRight = actor.viewMaxX;
    var thisRight = this.right;
    if (actorRight > thisRight) {
      var dx = thisRight - actorRight;
      actor.x += dx;
      actor.prevX += dx;
      return true;
    }
    return false;
  };
  /** {@link Camera#fullyOn} in only the y direction */
  this.fullyOnY = function(actor) {
    var actorTop = actor.viewMinY;
    var thisTop = this.top;
    if (actorTop < thisTop) {
      actor.y += thisTop - actorTop;
      return true;
    }

    var actorBottom = actor.viewMaxY;
    var thisBottom = this.bottom;
    if (actorBottom > thisBottom) {
      actor.y += thisBottom - actorBottom;
      return true;
    }
    return false;
  };

});
