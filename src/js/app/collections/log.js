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
      if (!isNaN(options.resourceId) && entry.get('resourceId') !== options.resourceId) {
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
      if (kcalsByDate[dateString]) {
        kcalsByDate[dateString] += entry.get('kcalCount');
      } else {
        kcalsByDate[dateString] = entry.get('kcalCount');
      }
    });
    return data;
  },

  comparator: function (entry) {
    return -(entry.get('date'));
  }

});

app.kcalLog = new CalorieLog();
