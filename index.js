
/**
 * Module dependencies.
 */
var each = require('each');
var model = require('model');
var defaults = require('model-defaults');
var timestamps = require('model-timestamps');
var validation = require('modella-validators');

/**
 * Types of events that can be reported.
 * [alarm/warning] without prefix is the sensor going
 * out of the boundaries it's set up with.
 */
var types = {
  25: 'alarm',
  20: 'warning',
  15: 'temperature alarm',
  10: 'temperature warning',
  5: 'battery alarm',
  1: 'battery warning'
};

/**
 * Event-type validation.
 * @param {Number} type
 * @return {Boolean}
 */
function isType(type){
  return type in types;
}

/**
 * Statuses of events that can be reported.
 */
var statuses = {
  10: 'corrected',
  5: 'acknowledged',
  1: 'unhandled'
};

/**
 * Event-status validation.
 * @param {Number} status
 * @return {Boolean}
 */
function isStatus(status){
  return status in statuses;
}

/**
 * Event model
 * All information retrieved and set through the use of the
 * event REST-API will have to conform with this model.
 *
 * Note that we use vehicle name instead of id. This is due
 * to it being too expensive to propagate such values for
 * time-series data.
 *
 * Payload is added sequentially, where the key represents
 * seconds since the event was triggered.
 */
var Event = model('Event')
  .use(defaults({'status': 1})) // Status is unhandled by default
  .use(timestamps)
  .use(validation)
  .attr('_id')
  .attr('vehicle', {required: true})
  .attr('sensor_id', {required: true})
  .attr('payload', {required: true})
  .attr('type', {type: 'number', validate: isType, required: true})
  .attr('status', {type: 'number', validate: isStatus});

Event.prototype.typeName = function(){
  return types[this.type()];
};

Event.prototype.statusName = function(){
  return statuses[this.status()];
};

/**
 * Type and status-constants.
 * Eg. Event.WARNING
 */
each(types, function(num, type){
  Event[type.replace(' ', '_').toUpperCase()] = num;
});
each(statuses, function(num, status){
  Event[status.replace(' ', '_').toUpperCase()] = num;
});

/**
 * Expose `Event`.
 */
module.exports = Event;

