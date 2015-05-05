/**
  * Jump up the platforms, dont fall off the bottom
  * @see https://play.google.com/store/apps/details?id=au.com.phil&hl=en
  * @requires scene 0.1.9
  */
import scene, communityart;

exports = scene(function() {
  // Add the background and the player
  var background = scene.addBackground(communityart('bg'), { scrollY: 1 });

  var player = scene.addPlayer(communityart('jumper'), {
    ay: 2000,
    vy: -2400,
    followTouches: { x: true },
    zIndex: 10,
    cameraFunction: scene.camera.wrapX
  });

  scene.onAccelerometer(function(e) { player.vx = -e.tilt * 3000; });

  // Show the game score
  scene.showScore(10, 10);

  var platforms = scene.addGroup();

  var platformSpawnFunction = function(x, y, index) {
    var platform = platforms.addActor(communityart('platform'), { isAnchored: true, x: x, y: y });
    platform.onEntered(scene.camera.bottomWall, function() { platform.destroy(); });
  };

  // Make the spawner
  var platformSpawner = scene.addSpawner(
    new scene.spawner.Vertical(
      new scene.shape.Rect(30, -300, scene.screen.width - 200, 200),
      platformSpawnFunction,
      200
    )
  );

  // Player collision rules
  scene.onCollision(player, platforms, function (player, platform) {
    if (player.vy < 0) { return; }
    // If last frame's player collision bottom was above the platform, hop
    var lastCollisionBottom = (player.model.getHitY() + player.model.getHitHeight()) - (player.y - player.model.getPreviousY());
    if (lastCollisionBottom < platform.model.getHitY()) {
      player.vy = -1350;
    }
  });

  player.onEntered(scene.camera.bottomWall, function() { player.destroy(); });

  // Add the camera to follow the player
  scene.camera.follow( player,
    new scene.shape.Rect(-200, scene.screen.midY, scene.screen.width + 400, scene.screen.height - 100)
  );

  // Update the score
  scene.onTick(function() {
    scene.setScore(Math.floor(-scene.camera.y));
  });
});