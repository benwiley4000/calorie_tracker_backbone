var app = app || {};

app.DayCalorieTotalView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#calories-history-item-template').html()),

  events: {
    'click': 'openDetails'
  },

  initialize: function (date, calories) {
    this.date = new Date(date);
    this.calories = calories;

    this.$el.addClass('calories-history-item');
  },

  render: function () {
    this.$el.html(this.template({
      date: this.date,
      calories: this.calories
    }));
    return this;
  },

  openDetails: function (e) {
    app.appView.trigger('opendetails', {
      format: 'day',
      date: this.date
    });
    /* keep the appView from responding to the click by
     * closing the details panel.
     */
    e.stopPropagation();
  }

});
