// import .Shape;

exports = function() {

  /**
    * @class Rect
    * @extends Shape
    *
    * @arg {number} x
    * @arg {number} y
    * @arg {number} width
    * @arg {number} height
    */
  this.init = function() {};

  /** @var {number} Rect#width */
  this.width = 0;
  /** @var {number} Rect#height */
  this.height = 0;

  /** @func Rect#left
      @returns {number} */
  this.left = function() {};
  /** @func Rect#right
      @returns {number} */
  this.right = function() {};
  /** @func Rect#top
      @returns {number} */
  this.top = function() {};
  /** @func Rect#bottom
      @returns {number} */
  this.bottom = function() {};


  this.getPointOn = function() {};
};