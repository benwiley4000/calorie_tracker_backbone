var app = app || {};

var CalorieLog = Backbone.Collection.extend({

  model: app.LogEntry,

  localStorage: new Backbone.LocalStorage('kcal-log-backbone'),

  initialize: function () {
    this.on('change', this.sort);
  },

  select: function (options) {
    options = options || {};
    return this.filter(function (entry) {
      if (options.resourceId && entry.get('resourceId') !== options.resourceId) {
        return false;
      }
      var entryDate = new Date(entry.get('date'));
      if (options.startDate && entryDate < app.LogEntry.getAdjustedDate(options.startDate)) {
        return false;
      }
      if (options.endDate && entryDate > app.LogEntry.getAdjustedDate(options.endDate)) {
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
      var dateString = new Date(entry.get('date')).toDateString();
      var kcalsByDate = data.kcalsByDate;
      var increment = entry.get('kcalCount');
      if (kcalsByDate[dateString]) {
        kcalsByDate[dateString] += increment;
      } else {
        kcalsByDate[dateString] = increment;
      }
      data.totalCalories += increment;
    });
    return data;
  },

  comparator: function (entry) {
    return -(entry.get('date'));
  }

});

app.kcalLog = new CalorieLog();
