
var assert = require('assert');
var Event = require('event-model');

describe('Event-model', function(){

  var happening;

  before(function(){
    happening = new Event({
      'type': Event.BATTERY_WARNING,
      'created_at': new Date(98, 1)
    });
  });

  it('should have a named type', function(){
    assert(happening.typeName() == 'battery warning');
  });

  it('should have a status by default', function(){
    assert(happening.statusName() == 'unhandled');
  });

  it('should be possible to override event-date', function(){
    assert(happening.created_at().getFullYear() == 1998);
  });

});

