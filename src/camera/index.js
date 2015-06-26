import .Camera;

exports = {
  /**
   * The scene camera is useful for following around an Actor. The camera can be
   * thought of as the rectangular region of world space that is currently visible to the user.
   * Default size is 576 x 1024
   * @var {Camera} scene.cam
   */
  camera: null,

  __listeners__: [
    {
      event: 'initGame',
      cb: function () {
        this.camera = new Camera(this.screen.width, this.screen.height);
      }
    },
    {
      event: 'updateScreenDimensions',
      cb: function () {
        if (this.camera) {
          this.camera.resize(this.scaleManager.width, this.scaleManager.height);
        }
      }
    },
    // Restart
    {
      event: 'restartGame',
      cb: function() {
        this.camera.stopFollowing();
        this.camera.x = 0;
        this.camera.y = 0;
      }
    },
    // Tick
    {
      event: 'tickUI',
      cb: function(dt) {
        var cam = this.camera;
        cam.update(dt);

        var stageStyle = this.stage.style;
        stageStyle.x = -cam.x;
        stageStyle.y = -cam.y;

        if (cam.following) {
          this.background.scrollTo(-cam.x, -cam.y);
        }
      }
    }
  ]
};
