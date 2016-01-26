var app = app || {};

app.SearchView = Backbone.View.extend({

  el: '#search',

  events: {
    'input #searchbar': 'autocompleteOnInput',
    'keypress #searchbar': 'searchOnEnter',
    'click #search-button': 'searchOnEnter'
  },

  initialize: function () {
    this.$searchbar = this.$('#searchbar');
    this.$autoResults = this.$('#auto-results');
    this.$searchResults = this.$('#search-results');

    this.loadingFrames = [
      'Loading',
      'Loading .',
      'Loading . .',
      'Loading . . .'
    ];

    // for some reason this doesn't work using the Backbone events hash
    this.$searchResults.scroll(this.loadMoreOnScrollEnd.bind(this));

    this.listenTo(app.searchResults, 'success:loadresults', this.handleResultsLoadSuccess);
    this.listenTo(app.searchResults, 'error:loadresults', this.handleResultsLoadError);
    this.listenTo(app.autoResults, 'sync', this.updateAutocomplete);
    this.listenTo(app.searchResults, 'sync', this.retrieveSearchResults);

    app.foodTrackerList.fetch();
    this.retrieveSearchResults();
  },

  updateAutocomplete: function () {
    var $autoResults = this.$autoResults;
    $autoResults.html('');
    app.autoResults.each(function (model) {
      var view = new app.AutoResultView({ model: model });
      $autoResults.append(view.render().el);
    });
  },

  retrieveSearchResults: function () {
    var $searchResults = this.$searchResults;
    $searchResults.html('');
    if(app.searchResults.length) {
      app.searchResults.each(function (model) {
        var view = new app.FoodResultView({ model: model });
        $searchResults.append(view.render().el);
      });
    } else {
      this.displayNoneFoundMessage();
    }
  },

  displayNoneFoundMessage: function () {
    this.$searchResults.html($('<p class="none-found">No results found.</p>'));
  },

  autocompleteOnInput: function () {
    var query = this.$searchbar.val().trim();
    if(query) {
      app.autoResults.autocomplete(query);
    }
  },

  searchOnEnter: function (event) {
    if(event.type !== 'click' && event.which !== ENTER_KEY) {
      return;
    }
    this.$searchbar.blur();
    var query = this.$searchbar.val().trim();
    if(query) {
      app.searchResults.search(query);
      this.displayLoadingIndicator();
    }
  },

  // calls loadMoreSearchResults 250 milliseconds after scrolling ends
  loadMoreOnScrollEnd: function (event) {
    if(this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(this.loadMoreSearchResults.bind(this), 250);
  },

  loadMoreSearchResults: function () {
    var searchResultsDiv = this.$searchResults[0];
    var scrollTop = searchResultsDiv.scrollTop;
    var maxScrollTop = searchResultsDiv.scrollHeight - searchResultsDiv.offsetHeight;
    // if we're close to the bottom, get more.
    if(scrollTop >= maxScrollTop - 100) {
      if(app.searchResults.loadNextSet()) {
        this.displayLoadingIndicator();
      }
    }
  },

  clearSearchResults: function () {
    this.$searchbar.val('');
    this.displayNoneFoundMessage();
  },

  handleResultsLoadSuccess: function () {
    this.hideLoadingIndicator();
  },

  handleResultsLoadError: function () {
    this.hideLoadingIndicator();

    var errorAlertContent =
      '<div class="load-error-container">' +
        '<div id="load-error" class="load-error">' +
          'We\'re having trouble fetching results . . .' +
        '</div>' +
      '</div>';
    this.$searchResults.append(errorAlertContent);

    // hide error message after 2.5 seconds
    setTimeout(function () {
      this.$('#load-error').parent().remove();
    }, 2500);
  },

  displayLoadingIndicator: function () {
    var initialLoadingContent =
      '<div class="loading-container">' +
        '<div id="loading" class="loading">' +
          this.loadingFrames[0] +
        '</div>' +
      '</div>';
    this.$searchResults.append(initialLoadingContent);
    this.currentLoadingFrame = 0;
    // progresses ellipses in 'Loading . . .' indicator every 100 milliseconds
    this.loadingInterval = setInterval(this.progressLoadingAnimation.bind(this), 100);
  },

  progressLoadingAnimation: function () {
    this.currentLoadingFrame++;
    if(this.currentLoadingFrame === 4) {
      this.currentLoadingFrame = 0;
    }
    this.$('#loading').text(this.loadingFrames[this.currentLoadingFrame]);
  },

  hideLoadingIndicator: function () {
    var $loading = $('#loading');
    if($loading.length) {
      $loading.parent().remove();
    }

    if(this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }

});