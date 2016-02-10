var app = app || {};

app.FoodResultView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#food-result-template').html()),

  events: {
    'click .track-food-button.untracked': 'trackStats',
    'click .track-food-button.tracked': 'stopTracking'
  },

  initialize: function () {
    this.$el.addClass('food-result');
    this.listenTo(app.foods, 'add', this.refreshAfterTracking);
  },

  render: function () {
    var attributes = this.model.attributes;

    var isTracking = app.foods.tracking(attributes.resource_id);
    var weekCalCount = 100; // TODO: IMPLEMENT THIS FOR REAL!!!

    var props = {
      item_name: attributes.item_name,
      brand_name: attributes.brand_name,
      thumbnail: attributes.thumbnail,
      nutrient_value: attributes.nutrient_value,
      nutrient_uom: attributes.nutrient_uom,
      serving_qty: attributes.serving_qty,
      serving_uom: attributes.serving_uom,
      resource_id: attributes.resource_id,
      isTracking: isTracking,
      weekCalCount: weekCalCount
    };

    this.$el.html(this.template(props));
    return this;
  },

  // checks if new FoodTracker has same resource_id as this food result; if so, re-renders
  refreshAfterTracking: function (model) {
    if (model.get('resource_id') === this.model.get('resource_id')) {
      this.render();
    }
  },

  // tracks this food in localStorage
  trackStats: function () {
    if (!app.foods.tracking(this.model.get('resource_id'))) {
      app.foods.create(this.model.attributes);
    }
  },

  // if user confirms, removes food from localStorage
  stopTracking: function() {
    var message =
      'Are you sure you want to delete all data for ' +
      this.model.get('item_name') +
      '?';
    if (window.confirm(message)) {
      app.foods.filter(function (food) {
        return food.get('resource_id') === this.model.get('resource_id');
      }, this).forEach(function (food) {
        app.foods.remove(food);
      });
      this.render();
    }
  }

});