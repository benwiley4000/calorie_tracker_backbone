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
  }

});

app.foods = new FoodList();