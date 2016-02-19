var app = app || {};

app.LogEntry = Backbone.Model.extend({

  constructor: function () {
    arguments[0].date = app.LogEntry.getAdjustedDate(arguments[0].date);
    Backbone.Model.apply(this, arguments);
  },
  
  setDate: function (date) {
    var adjustedDate = app.LogEntry.getAdjustedDate(date);
    this.set({ date: adjustedDate });
  },

  setCalorieCount: function (kcalCount) {
    this.set({ kcalCount: kcalCount });
  }

});

/* given a date, returns one that will always have the same
 * day of the week regardless of the current timezone
 */
app.LogEntry.getAdjustedDate = function (date) {
  var adjustedDate = new Date(date);

  // clear all time of day data
  adjustedDate.setUTCHours(0);
  adjustedDate.setUTCMinutes(0);
  adjustedDate.setUTCSeconds(0);
  adjustedDate.setUTCMilliseconds(0);

  // set time to noon UTC
  adjustedDate.setUTCMinutes(12 * 60);

  // ensure we're not going to be off by one day
  adjustedDate.setUTCDate(date.getDate());

  return adjustedDate;
};
