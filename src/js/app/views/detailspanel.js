var app = app || {};

app.DetailsPanelView = Backbone.View.extend({

  el: '#details-panel',

  foodTemplate: _.template($('#food-calories-history-template').html()),

  dayTemplate: _.template($('#day-calories-history-template').html()),

  events: {
    'click': 'close'
  },

  initialize: function () {
    // pass (for now)
  },

  render: function (options) {
    if (options.format === 'food') {
      var food = options.model;
      
    } else if (options.format === 'day') {

    } else {
      console.error('Unrecognized details panel format:', options.format);
    }
  },

  close: function () {
    app.appView.trigger('closedetails');
  }

});
