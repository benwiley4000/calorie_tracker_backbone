var app = app || {};

app.FoodResultView = Backbone.View.extend({

  tagName: 'div',

  template: _.template($('#food-result-template').html()),

  events: {
    'click .food-result-title': 'openDetails',
    'click .food-result-thumbnail': 'openDetails',
    'click .track-food-button.untracked': 'trackStats',
    'click .track-food-button.tracked': 'stopTracking',
    'click .new-log-entry-button': 'createLogEntry'
  },

  initialize: function () {
    this.$el.addClass('food-result');

    this.listenTo(app.foods, 'add', this.refreshAfterTracking);
    
    var resourceId = this.model.get('resource_id');
    var storedModel = app.foods.get(resourceId);
    if (storedModel) {
      this.listenTo(storedModel, 'logupdate', this.render);
    }
  },

  render: function () {
    var attributes = this.model.attributes;

    var isTracking = app.foods.get(attributes.resource_id) ? true : false;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var weekCalCount = this.model.getLogData({
      startDate: oneWeekAgo
    }).totalCalories;

    var props = {
      item_name: attributes.item_name,
      brand_name: attributes.brand_name,
      thumbnail: attributes.thumbnail,
      nutrient_value: attributes.nutrient_value,
      nutrient_uom: attributes.nutrient_uom,
      serving_qty: attributes.serving_qty,
      serving_uom: attributes.serving_uom,
      resource_id: attributes.resource_id,
      isTracking: isTracking,
      weekCalCount: weekCalCount
    };

    this.$el.html(this.template(props));
    return this;
  },

  openDetails: function (e) {
    if (app.foods.get(this.model.get('resource_id'))) {
      app.appView.trigger('opendetails', {
        format: 'food',
        model: this.model
      });
      /* keep the appView from responding to the click by
       * closing the details panel.
       */
      e.stopPropagation();
    }
  },

  // checks if new FoodTracker has same resource_id as this food result; if so, re-renders
  refreshAfterTracking: function (model) {
    if (model.get('resource_id') === this.model.get('resource_id')) {
      this.render();
    }
  },

  // tracks this food in localStorage
  trackStats: function (e) {
    if (!app.foods.get(this.model.get('resource_id'))) {
      var food = app.foods.create(this.model.attributes);
      this.listenTo(food, 'logupdate', this.render);
      // we don't want the details panel to immediately open
      e.stopPropagation();
    }
  },

  // if user confirms, removes food from localStorage
  stopTracking: function (e) {
    var message =
      'Are you sure you want to delete all data for ' +
      this.model.get('item_name') +
      '?';
    if (window.confirm(message)) {
      var resourceId = this.model.get('resource_id');
      app.foods.filter(function (food) {
        return food.get('resource_id') === resourceId;
      }, this).forEach(function (food) {
        this.stopListening(food);
        food.destroy();
      }, this);
      app.kcalLog.where({
        resourceId: resourceId
      }).forEach(function (log) {
        log.destroy();
      });
      this.render();
    } else {
      /* we want to prevent the details panel from opening
       * if the user decides not to stop tracking.
       */
      e.stopPropagation();
    }
  },

  // launch window to create new log entry for this food
  createLogEntry: function (e) {
    if (app.foods.get(this.model.get('resource_id'))) {
      app.appView.trigger('openlogentry', {
        action: 'new',
        food: this.model
      });
      // Prevent the details panel from opening.
      e.stopPropagation();
    }
  }

});
