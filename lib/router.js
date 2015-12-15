'use strict';

/**
 * @constructor
 */
var Router = module.exports = function (paths) {
	this.hasten = {};
	this.routes = {};
	this.paths = paths;
};

/**
 * Navigate to a route
 *
 * @param  {String} name Route name
 * @param  {*}      arg  A single argument to pass to the route handler
 */
Router.prototype.navigate = function (name, arg) {
  if (typeof this.routes[name] === 'function') {
    return this.routes[name].call(null, this, arg);
  }

  throw new Error('no routes called: ' + name);
};

/**
 * Register a route handler
 *
 * @param {String}   name    Name of the route
 * @param {Function} handler Route handler
 */
Router.prototype.registerRoute = function (name, handler) {
  this.routes[name] = handler;
  return this;
};
