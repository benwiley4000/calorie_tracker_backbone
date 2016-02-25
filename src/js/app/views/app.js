var app = app || {};

// top-level UI
app.AppView = Backbone.View.extend({

  el: '#health-tracker-app',

  events: {
    'click': 'handleClick'
  },

  initialize: function () {
    app.foods.fetch();
    app.kcalLog.fetch();

    this.searchView = new app.SearchView();
    this.trackersView = new app.TrackersView();
    this.detailsPanelView = new app.DetailsPanelView();
    this.logEntryView = new app.LogEntryView();

    this.on('pageswap', this.swapView);
    this.on('opendetails', this.openDetails);
    this.on('closedetails', this.closeDetails);
    this.on('openlogentry', this.openLogEntry);
    this.on('closelogentry', this.closeLogEntry);
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
    try {
      this.detailsPanelView.render(options);
      this.detailsPanelView.$el.removeClass('hidden');
    } catch (e) {
      console.error(e);
    }
  },

  closeDetails: function () {
    this.detailsPanelView.$el.addClass('hidden');
  },

  openLogEntry: function (options) {
    try {
      this.logEntryView.open(options);
      this.logEntryView.$el.removeClass('hidden');
    } catch (e) {
      console.error(e);
    }
  },

  closeLogEntry: function () {
    this.logEntryView.$el.addClass('hidden');
  },

  handleClick: function () {
    /* if the user clicks outside of the details panel (and it's
     * currently styled as a floating window) then close it.
     */
    if (this.detailsPanelView.$el.css('position') === 'absolute') {
      this.closeDetails();
    }

    this.closeLogEntry();
  }

});
