var app = app || {};

app.DetailsPanelView = Backbone.View.extend({

  el: '#details-panel',

  foodTemplate: _.template($('#food-calories-history-template').html()),

  dayTemplate: _.template($('#day-calories-history-template').html()),

  events: {
    'click #details-panel-close': 'close'
  },

  initialize: function () {
    this.$caloriesHistory = this.$('#calories-history');
  },

  render: function (options) {
    if (options.format === 'food') {

      var food = options.model;
      var logData = food.getLogData();
      var todaysDateString = new Date().toDateString();
      var props = {
        name: food.get('item_name'),
        image: food.get('thumbnail'),
        totalCalories: logData.totalCalories,
        todayCalories: logData.kcalsByDate[todaysDateString] || 0
      };
      this.$caloriesHistory.html(this.foodTemplate(props));

    } else if (options.format === 'day') {

      var date = options.date;
      var logData = app.kcalLog.getData({
        startDate: date,
        endDate: date
      });
      var props = {
        date: date.toDateString(),
        calories: logData.totalCalories
      };
      this.$caloriesHistory.html(this.dayTemplate(props));

    } else {

      throw new Error('Unrecognized details panel format: ' + options.format || 'undefined');

    }
  },

  close: function () {
    app.appView.trigger('closedetails');
  }

});
