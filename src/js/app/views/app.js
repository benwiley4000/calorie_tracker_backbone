var app = app || {};

// top-level UI
app.AppView = Backbone.View.extend({

  el: '#health-tracker-app',

  events: {
    // 'click #[searchNavButton]': 'openSearchView',
    // 'click #[trackersNavButton]': 'openTrackersView'
  },

  initialize: function () {
    this.searchView = new app.SearchView();
    this.trackersView = new app.TrackersView();
  },

  openSearchView: function () {
    this.searchView.clearSearchResults();
    this.searchView.$el.removeClass('hidden');
    this.trackersView.$el.addClass('hidden');
  },

  openTrackersView: function () {
    this.trackersView.update();
    this.trackersView.$el.removeClass('hidden');
    this.searchView.$el.addClass('hidden');
  }

});