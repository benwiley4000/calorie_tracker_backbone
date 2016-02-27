var app = app || {};

app.HistoryItemView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#calories-history-item-template').html()),

  events: {
    'click': 'editLogEntry'
  },

  initialize: function () {
    this.$el.addClass('calories-history-item');

    this.food = app.foods.get(this.model.get('resourceId'));
  },

  render: function () {
    var food = this.food;
    var entry = this.model;

    var props = {
      name: food.get('item_name'),
      brandName: food.get('brand_name'),
      calories: entry.get('kcalCount'),
      date: new Date(entry.get('date'))
    };

    this.$el.html(this.template(props));
    return this;
  },

  // launch window to edit this item's log entry
  editLogEntry: function (e) {
    app.appView.trigger('openlogentry', {
      action: 'edit',
      entry: this.model
    });
    /* keep details panel from picking up click and
     * closing the log entry view.
     */
    e.stopPropagation();
  }

});
