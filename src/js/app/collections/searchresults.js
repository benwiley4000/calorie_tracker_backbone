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

  url: function () {
    // we impose a hard limit of 50 results, since the API doesn't allow
    // anything greater than that.
    return 'https://apibeta.nutritionix.com/v2/search?q=' + this.query +
      '&limit=' + Math.min(50, (this.loadLimit * this.loadCount)) + '&offset=0' +
      '&appId=eb3bbaeb&appKey=4c8398b6c27e2dc907348213956bc02f';
  },

  parse: function (response) {
    if(response.results && response.results.length) {
      return response.results;
    } else if(response.errors && response.errors.length && response.errors[0].message) {
      this.trigger('error:search', response.errors[0].message);
    }
    return [];
  },

  // searches Nutritionix API for given term
  search: function (query) {
    if(query === this.query) return;
    this.query = query;
    this.loadCount = 1;
    this.fetch({
      error: function () {
        this.trigger('error:search');
      }
    });
  },

  // fetches the next set of search results
  loadNextSet: function () {
    this.loadCount++;
    this.fetch({
      error: function () {
        this.trigger('error:loadmoreresults');
      }
    });
  }

});

app.searchResults = new SearchResultList();