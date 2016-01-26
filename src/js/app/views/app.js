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
    this.searchView.$el.show();
    this.trackersView.$el.hide();
  },

  openTrackersView: function () {
    this.trackersView.update();
    this.trackersView.$el.show();
    this.searchView.$el.hide();
  }

});