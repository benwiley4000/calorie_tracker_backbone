var app = app || {};

// top-level UI
app.AppView = Backbone.View.extend({

  el: '#health-tracker-app',

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
        var view = new app.SearchResultView({ model: model });
        $searchResults.append(view.render().el);
      });
    } else {
      $searchResults.append($('<p class="none-found">No results found.</p>'));
    }
  },

  autocompleteOnInput: function () {
    var query = this.$searchbar.val().trim();
    if(query) {
      app.autoResults.autocomplete(query);
    }
  },

  searchOnEnter: function (event) {
    if(event.type !== 'click' && event.which !== ENTER_KEY) return;
    this.$searchbar.blur();
    var query = this.$searchbar.val().trim();
    if(query) {
      app.searchResults.search(query);
      this.displayLoadingIndicator();
    }
  },

  // calls loadMoreSearchResults 400 milliseconds after scrolling ends
  loadMoreOnScrollEnd: function (event) {
    if(this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(this.loadMoreSearchResults.bind(this), 400);
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

  handleResultsLoadSuccess: function () {
    this.hideLoadingIndicator();
  },

  handleResultsLoadError: function () {
    this.hideLoadingIndicator();

    // display load error message
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
    $('#loading').text(this.loadingFrames[this.currentLoadingFrame]);
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