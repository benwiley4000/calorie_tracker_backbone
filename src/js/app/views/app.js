var app = app || {};

// top-level UI
app.AppView = Backbone.View.extend({

  el: '#health-tracker-app',

  initialize: function () {
    app.foods.fetch();
    app.kcalLog.fetch();

    this.searchView = new app.SearchView();
    this.trackersView = new app.TrackersView();
    this.detailsPanelView = new app.DetailsPanelView();

    this.on('pageswap', this.swapView);
    this.on('opendetails', this.openDetails);
    this.on('closedetails', this.closeDetails);
  },

  swapView: function () {
    this.updateNavBar();
    if (app.page === 'trackers') {
      this.openTrackersView();
    } else {
      this.openSearchView();
    }
  },

  updateNavBar: function () {
    this.$('.page-link')
      .removeClass('selected')
      .filter('[href="#/' + (app.page || 'search') + '"]')
      .addClass('selected');
  },

  openSearchView: function () {
    this.searchView.clearSearchResults();
    this.searchView.$el.removeClass('hidden');
    this.trackersView.$el.addClass('hidden');
  },

  openTrackersView: function () {
    this.trackersView.render();
    this.trackersView.$el.removeClass('hidden');
    this.searchView.$el.addClass('hidden');
  },

  openDetails: function (options) {
    this.detailsPanelView.render(options);
    this.detailsPanelView.$el.removeClass('hidden');
  },

  closeDetails: function () {
    this.detailsPanelView.$el.addClass('hidden');
  }

});
