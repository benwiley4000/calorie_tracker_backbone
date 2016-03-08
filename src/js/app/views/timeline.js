var app = app || {};

app.TimelineView = Backbone.View.extend({

  el: '#timeline',

  events: {
    'click #previous-month': 'openPreviousMonth',
    'click #next-month': 'openNextMonth'
  },

  initialize: function () {
    this.MONTH_NAMES = [
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

    this.$dailyCalorieTotals = this.$('#daily-calorie-totals');

    this.listenTo(app.kcalLog, 'add', this.updateIfOpen);
    this.listenTo(app.kcalLog, 'sort', this.updateIfOpen);
    this.listenTo(app.kcalLog, 'remove', this.updateIfOpen);

    this.logData = null;
    this.chartDataList = null;
    this.monthBounds = null;

    /* re-render on window resize, but wait 200 milliseconds
     * so we don't bash the render engine unnecessarily.
     */
    var renderOnResizeTimeout = null;
    $(window).resize(function () {
      clearTimeout(renderOnResizeTimeout);
      if (this.isOpen()) {
        renderOnResizeTimeout = setTimeout(this.render.bind(this), 200);
      }
    }.bind(this));
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
    var logData = this.logData = app.kcalLog.getData(this.monthBounds);
    var kcalsByDate = logData.kcalsByDate;

    var chartDataList = this.chartDataList = [];
    var monthBounds = this.monthBounds;
    var d = new Date(monthBounds.startDate);
    var limit = new Date(monthBounds.endDate);
    limit.setDate(limit.getDate() + 1);
    while (d < limit) {
      var dateString = d.toDateString();
      if (kcalsByDate[dateString]) {
        chartDataList.push({
          'date': new Date(dateString),
          'Calories': kcalsByDate[dateString]
        });
      } else {
        chartDataList.push({
          'date': new Date(d),
          'Calories': 0
        });
      }
      d.setDate(d.getDate() + 1);
    }
  },

  openPreviousMonth: function () {
    var date = new Date(this.monthBounds.startDate);
    date.setMonth(date.getMonth() - 1);
    this.open(date);
  },

  openNextMonth: function () {
    var date = new Date(this.monthBounds.startDate);
    date.setMonth(date.getMonth() + 1);
    this.open(date);
  },

  updateIfOpen: function () {
    if (this.isOpen()) {
      this.open(this.monthBounds.startDate);
    }
  },

  render: function () {
    this.renderChart();
    this.renderDailyTotals();
  },

  renderChart: function () {
    var totalCalories = this.logData.totalCalories;
    var monthBounds = this.monthBounds;
    var monthName = this.MONTH_NAMES[monthBounds.startDate.getMonth()];
    var year = monthBounds.startDate.getFullYear();
    MG.data_graphic({
      'title': monthName + ' ' + year + ': ' + totalCalories.toLocaleString() + ' Total Cal',
      'data': this.chartDataList,
      'target': '#timeline-chart',
      'x_accessor': 'date',
      'y_accessor': 'Calories',
      'mouseover_align': 'center',
      'y_rollover_format': function (data) {
        return data['Calories'].toLocaleString() + ' Cal';
      },
      'buffer': 1,
      'left': 35,
      'right': 15,
      'bottom': 30,
      'top': 60,
      /* if we use this while the view is hidden it will create an error,
       * since there is no computed value.
       */
      'full_width': this.isOpen(),
      'full_height': this.isOpen(),
    });
  },

  renderDailyTotals: function () {
    $dailyCalorieTotals = this.$dailyCalorieTotals;
    $dailyCalorieTotals.html('');

    if (!this.logData.totalCalories) {
      $dailyCalorieTotals.html($('<p class="none-found">No entries found.</p>'));
      return;
    }

    var lastEntryWasMissing = false;
    var numEntries = 0;
    this.chartDataList.forEach(function (data) {
      if (!data['Calories']) {
        lastEntryWasMissing = true;
        return;
      }
      if (lastEntryWasMissing && numEntries) {
        $dailyCalorieTotals.append($('<hr>'));
      }
      var view = new app.DayCalorieTotalView(data['date'], data['Calories']);
      $dailyCalorieTotals.append(view.render().el);
      lastEntryWasMissing = false;
      numEntries++;
    });
  },

  isOpen: function () {
    return !this.$el.hasClass('hidden');
  }

});
