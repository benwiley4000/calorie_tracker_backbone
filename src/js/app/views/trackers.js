var app = app || {};

app.TrackersView = Backbone.View.extend({

  el: '#trackers',

  /*
  events: {
    'input #searchbar': 'autocompleteOnInput',
    'keypress #searchbar': 'searchOnEnter',
    'click #search-button': 'searchOnEnter'
  },
  */

  initialize: function () {
    this.$trackerList = this.$('#tracker-list');

    /*
    this.listenTo(app.todos, 'add', this.addOne);
    this.listenTo(app.todos, 'reset', this.addAll);
    this.listenTo(app.todos, 'change:completed', this.filterOne);
    this.listenTo(app.todos, 'filter', this.filterAll);
    this.listenTo(app.todos, 'all', this.render);
    */

    this.update();
  },

  render: function () {
    var $trackerList = this.$trackerList;
    $trackerList.html('');
    if(app.searchResults.length) {
      app.searchResults.each(function (model) {
        var view = new app.FoodResultView({ model: model });
        $trackerList.append(view.render().el);
      });
    } else {
      $trackerList.append($('<p class="none-found">No foods tracked.</p>'));
    }
  },

  update: function () {
    app.foodTrackerList.fetch();
    this.render();
  }

});