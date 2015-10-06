var app = app || {};

/*
 * A Collection structure that contains search results
 * from the Nutritionix Health API
 * https://developer.nutritionix.com/docs
 */
var SearchResultList = Backbone.Collection.extend({

  model: app.SearchResult,

  query: '',

  url: function () {
    return 'https://apibeta.nutritionix.com/v2/search?q=' + this.query +
      '&appId=eb3bbaeb&appKey=4c8398b6c27e2dc907348213956bc02f';
  },

  parse: function (response) {
    return (response.results && response.results.length) ? response.results : [];
  },

  // searches Nutritionix API for given term
  search: function (query) {
    this.query = query;
    this.fetch({
      error: function () {
        this.trigger('error:search');
      }
    });
  }

});

app.searchResults = new SearchResultList();