var app = app || {};

app.SearchResultView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#search-result-template').html()),

  events: {},

  initialize: function () {
    this.events['click track-' + this.model.get('resource_id')] = 'trackStats';

    this.$el.addClass('search-result');
  },

  render: function () {
    var attributes = this.model.attributes;

    var isTracking = app.foodTrackerList.isTracking(attributes.resource_id);
    var weekCalCount = 100; // IMPLEMENT THIS FOR REAL!!!

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

  // tracks this food in localStorage
  trackStats: function () {
    app.foods.create(this.model.attributes);
  }

});