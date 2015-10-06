var app = app || {};

var FoodTrackerList = Backbone.Collection.extend({

  model: app.FoodTracker,

  localStorage: new Backbone.LocalStorage('food-trackers-backbone'),

  getTrackerByResourceId: function (resourceId) {
    var tracker = this.find(function (model) {
      return model.attributes.resource_id === resourceId;
    });
    if(!tracker) {
      console.log('No calorie counter found for resource id "' + resourceId + '"');
    }
    return tracker;
  }

});

app.foodTrackers = new FoodTrackerList();