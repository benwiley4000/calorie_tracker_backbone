var app = app || {};

/*
 * A Collection structure that contains search results
 * from the Nutritionix Health API
 * https://developer.nutritionix.com/docs
 */
var SearchResultList = Backbone.Collection.extend({

  model: app.FoodProfile,

  query: '',

  // this determines how many new search results get loaded at a time
  loadLimit: 8,

  // this determines how many asynchronous calls for search results have
  // been made for the current query
  loadCount: 1,

  // used for comparison when new results come in
  lastResultCount: 0,

  // keeps track of whether query has been exhausted; if yes,
  // calls for loading the next set will simply return false.
  isQueryExhausted: false,

  url: function () {
    // we impose a hard limit of 50 results, since the API doesn't allow
    // anything greater than that.
    return 'https://apibeta.nutritionix.com/v2/search?q=' + this.query +
      '&limit=' + Math.min(50, (this.loadLimit * this.loadCount)) + '&offset=0' +
      '&appId=eb3bbaeb&appKey=4c8398b6c27e2dc907348213956bc02f';
  },

  parse: function (response) {
    if (response.results && response.results.length) {
      return response.results;
    } else if (response.errors && response.errors.length && response.errors[0].message) {
      this.trigger('error:search', response.errors[0].message);
    }
    return [];
  },

  // searches Nutritionix API for given term
  search: function (query) {
    if (query === this.query || query === '') return;
    this.isQueryExhausted = false;
    this.lastResultCount = 0;
    this.query = query;
    this.loadCount = 1;
    this.fetch({
      success: function () {
        this.trigger('success:loadresults');
      }.bind(this),
      error: function () {
        this.trigger('error:loadresults');
      }.bind(this)
    });
  },

  // fetches the next set of search results; returns
  // false if we've reached the max load limit
  loadNextSet: function () {
    if (this.isQueryExhausted) return false;

    // compare current result count with last to see if query is exhausted
    if (this.length === this.lastResultCount) {
      this.isQueryExhausted = true;
      return false;
    }

    this.lastResultCount = this.length;

    if ((this.loadLimit * this.loadCount) >= 50) {
      return false;
    }
    this.loadCount++;
    this.fetch({
      success: function () {
        this.trigger('success:loadresults');
      }.bind(this),
      error: function () {
        this.trigger('error:loadresults');
      }.bind(this)
    });
    return true;
  }

});

app.searchResults = new SearchResultList();