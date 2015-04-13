
/**
  * A group of {@link Actor}s, with various functionality for operating on the group as a whole.
  * @class Group
  */
exports = function() {

  /** Private list of registered spawners
    * @var Group#_spawners */
  this._spawners = [];

  /**
    * Helper object for creating and registering new things
    * @var {Object} Group#add
    * @prop {function} actor - Returns a new {@link Actor}
    * @prop {function} spawner - Returns a new {@link Spawner}
    */
  this.add = {
    spawner: function() {},
    actor: function() {}
  };

  /**
    * Register a new actor for this group. Not needed if you have used {@link Group#add}.
    * Will make sure that the actor has not been added to another group already.
    * @func Group#registerActor
    * @arg {Actor} actorInstance
    * @returns {Actor}
    */
  this.registerActor = function(actorInstance) {};

  /**
    * Remove an actor from this group, will not cause the actor to be destroyed.
    * @func Group#removeActor
    * @arg {Actor} actorInstance
    */
  this.removeActor = function(actorInstance) {};

  /**
    * Register a new spawner for this group. Not needed if you have used {@link Group#add}
    * @func Group#registerSpawner
    * @arg {Spawner} spawnerInstance
    * @returns {Spawner}
    * @see Group#spawn
    */
  this.registerSpawner = function(spawnerInstance) {};

  /**
    * Remove a spawner that exists
    * @func Group#removeSpawner
    * @arg {Spawner} spawnerInstance
    */
  this.removeSpawner = function(spawnerInstance) {};

  /**
    * Forwards a call on to one of the registered {@link Spawner}s, but forces a position if the argument is set.
    * @func Group#spawn
    * @arg {Point} [position] - If not set, a random point will be chosen from the spawner.
    * @returns {Actor}
    * @see Group#addSpawner
    */
  this.spawn = function(position) {};

};