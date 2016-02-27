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

    /* since we stop click event propagation from popups, we
     * need to make sure we close one if we click in the other one.
     */
    this.detailsPanelView.$el.click(this.closeLogEntry.bind(this));
    this.logEntryView.$el.click(this.closeDetailsPopup.bind(this));
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
      this.detailsPanelView.open(options);
      this.closeLogEntry();
      this.detailsPanelView.$el.removeClass('hidden');
    } catch (e) {
      console.error(e);
    }
  },

  closeDetails: function () {
    this.detailsPanelView.$el.addClass('hidden');
  },

  // closes the details panel, but only if it's currently a popup
  closeDetailsPopup: function () {
    if (this.detailsPanelView.$el.css('position') === 'absolute') {
      this.closeDetails();
    }
  },

  openLogEntry: function (options) {
    try {
      this.logEntryView.open(options);
      this.closeDetailsPopup();
      this.logEntryView.$el.removeClass('hidden');
    } catch (e) {
      console.error(e);
    }
  },

  closeLogEntry: function () {
    this.logEntryView.$el.addClass('hidden');
  },

  handleClick: function () {
    // if the user clicks outside of a popup then close it.
    this.closeDetailsPopup();
    this.closeLogEntry();
  }

});
