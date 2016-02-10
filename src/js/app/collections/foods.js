var app = app || {};

var FoodList = Backbone.Collection.extend({

  model: app.Food,

  localStorage: new Backbone.LocalStorage('foods-backbone'),

  comparatorType: 'item_name',

  acceptableComparatorTypes: ['item_name', 'brand_name', 'nutrient_value'],

  changeComparatorType: function (comparatorType) {
    if (this.acceptableComparatorTypes.indexOf(comparatorType) > -1) {
      this.comparatorType = comparatorType;
    }
  },

  comparator: function (food) {
    return food.get(this.comparatorType);
  },

  // returns true if the given resourceId is contained, false otherwise
  tracking: function (resourceId) {
    return this.some(function (model) {
      return model.attributes.resource_id === resourceId;
    });
  }

});

app.foods = new FoodList();