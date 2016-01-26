var app = app || {};

/*
 * A Collection structure that contains query autocomplete results
 * from the Nutritionix Health API
 * https://developer.nutritionix.com/docs
 */
var AutoResultList = Backbone.Collection.extend({

  model: app.AutoResult,

  query: '',

  url: function () {
    return 'https://apibeta.nutritionix.com/v2/autocomplete/?q=' + this.query +
      '&appId=eb3bbaeb&appKey=4c8398b6c27e2dc907348213956bc02f';
  },

  parse: function (response) {
    return response.length ? response : [];
  },

  // queries autocomplete for the given term
  autocomplete: function (query) {
    if (query === this.query || query === '') return;
    this.query = query;
    this.fetch();
  }

});

app.autoResults = new AutoResultList();