var app = app || {};

var CalorieLog = Backbone.Collection.extend({

  model: app.LogEntry,

  localStorage: new Backbone.LocalStorage('kcal-log-backbone'),

  comparator: 'date',

  select: function (options) {
    options = options || {};
    return this.filter(function (entry) {
      if (!isNaN(options.resourceId) && entry.resourceId !== options.resourceId) {
        return false;
      }
      if (options.startDate && entry.date < app.LogEntry.getAdjustedDate(options.startDate)) {
        return false;
      }
      if (options.endDate && entry.date > app.LogEntry.getAdjustedDate(options.endDate)) {
        return false;
      }
      return true;
    });
  },

  getData: function (options) {
    var results = this.select(options);
    var data = {
      results: results,
      totalCalories: 0,
      kcalsByDate: {}
    };
    results.forEach(function (entry) {
      var dateString = entry.date.toDateString();
      var kcalsByDate = data.kcalsByDate;
      if (kcalsByDate[dateString]) {
        kcalsByDate[dateString] += entry.kcalCount;
      } else {
        kcalsByDate[dateString] = entry.kcalCount;
      }
    });
    return data;
  }

});

app.kcalLog = new CalorieLog();
