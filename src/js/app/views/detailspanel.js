var app = app || {};

app.DetailsPanelView = Backbone.View.extend({

  el: '#details-panel',

  foodTemplate: _.template($('#food-calories-history-template').html()),

  dayTemplate: _.template($('#day-calories-history-template').html()),

  events: {
    'click': 'preventClose',
    'click #details-panel-close': 'close'
  },

  initialize: function () {
    this.$caloriesHistory = this.$('#calories-history');
  },

  render: function (options) {
    var logData;
    var props;
    if (options.format === 'food') {

      var food = options.model;
      var todaysDateString = new Date().toDateString();
      logData = food.getLogData();
      props = {
        name: food.get('item_name'),
        image: food.get('thumbnail'),
        totalCalories: logData.totalCalories,
        todayCalories: logData.kcalsByDate[todaysDateString] || 0
      };
      this.$caloriesHistory.html(this.foodTemplate(props));

    } else if (options.format === 'day') {

      var date = options.date;
      logData = app.kcalLog.getData({
        startDate: date,
        endDate: date
      });
      props = {
        date: date.toDateString(),
        calories: logData.totalCalories
      };
      this.$caloriesHistory.html(this.dayTemplate(props));

    } else {

      throw new Error('Unrecognized details panel format: ' + options.format || 'undefined');

    }
  },

  /* keeps appView from closing the details panel in
   * response to a random click inside the actual panel
   */
  preventClose: function (e) {
    e.stopPropagation();
  },

  close: function () {
    app.appView.trigger('closedetails');
  }

});
