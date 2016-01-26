var app = app || {};

var FoodTrackerList = Backbone.Collection.extend({

  model: app.FoodTracker,

  localStorage: new Backbone.LocalStorage('food-trackers-backbone'),

  // we tell quiet to be true in cases where we wouldn't consider
  // a find failure to be an error
  getTrackerByResourceId: function (resourceId, quiet) {
    var tracker = this.find(function (model) {
      return model.attributes.resource_id === resourceId;
    });
    if (!tracker && !quiet) {
      console.log('No calorie tracker found for resource id "' + resourceId + '"');
    }
    return tracker;
  },

  isTracking: function (resourceId) {
    if (this.getTrackerByResourceId(resourceId, true)) {
      return true;
    }
    return false;
  }

});

app.foodTrackerList = new FoodTrackerList();