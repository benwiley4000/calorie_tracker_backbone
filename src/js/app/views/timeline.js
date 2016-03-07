var app = app || {};

app.MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

app.TimelineView = Backbone.View.extend({

  el: '#timeline',

  initialize: function () {
    this.data = null;
    this.month = null;
    this.monthBounds = null;
  },

  open: function (date) {
    date = date || new Date();
    var year = date.getFullYear();
    var month = date.getMonth(); // 0-based
    this.monthBounds = {
      startDate: new Date(year, month, 1),
      endDate: new Date(year, month + 1, 0)
    };
    this.fetchData();
    this.render();
  },

  fetchData: function () {
    this.data = app.kcalLog.getData(this.monthBounds);
  },

  render: function () {
    this.renderChart();
    this.renderDailyTotals();
  },

  renderChart: function () {
    var data = this.data;
    var totalCalories = data.totalCalories;
    var kcalsByDate = data.kcalsByDate;
    var chartData = Object.keys(kcalsByDate).map(function (date) {
      return {
        'date': new Date(date),
        'Calories': kcalsByDate[date]
      };
    });
    var monthName = app.MONTH_NAMES[this.monthBounds.startDate.getMonth()];
    MG.data_graphic({
      'title': monthName + ' 2016: ' + totalCalories.toLocaleString() + ' Total Cal',
      'data': chartData,
      'target': '#timeline-chart',
      'x_accessor': 'date',
      'y_accessor': 'Calories',
      'xax_format': d3.time.format('%e %b'),
      'x_rollover_format': '%e %b: ',
      'y_rollover_format': function (d) {
        return d['Calories'].toLocaleString() + ' Cal'
      },
      'buffer': 0,
      'left': 50,
      'right': 20,
      /* if we use this while the view is hidden it will create an error,
       * since there is no computed width.
       */
      'full_width': !this.$el.hasClass('hidden')
    });
  },

  renderDailyTotals: function () {

  }

});