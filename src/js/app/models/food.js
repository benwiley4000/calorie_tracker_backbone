var app = app || {};

app.Food = Backbone.Model.extend({

  getLogData: function (options) {
    options = options || {};
    return app.kcalLog.getData({
      resourceId: this.get('resource_id'),
      startDate: options.startDate,
      endDate: options.endDate
    });
  },

  addLogEntry: function (kcalCount, date) {
    if (!isNaN(kcalCount) && !isNaN(date.getTime())) {
      app.kcalLog.create({
        resourceId: this.get('resource_id'),
        kcalCount: kcalCount,
        date: date
      });
    } else {
      console.error('Invalid log entry data:', kcalCount, date);
    }
  }

});