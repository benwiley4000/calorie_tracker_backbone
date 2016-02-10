var app = app || {};

app.TrackersView = Backbone.View.extend({

  el: '#trackers',

  initialize: function () {
    this.$trackerList = this.$('#tracker-list');

    this.listenTo(app.foods, 'remove', this.render);

    this.render();
  },

  render: function () {
    var $trackerList = this.$trackerList;
    $trackerList.html('');
    if (app.foods.length) {
      app.foods.each(function (model) {
        var view = new app.FoodResultView({ model: model });
        $trackerList.append(view.render().el);
      });
    } else {
      $trackerList.append($('<p class="none-found">No foods tracked.</p>'));
    }
  }

});