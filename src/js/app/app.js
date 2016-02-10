var app = app || {};
var ENTER_KEY = 13;

$(function () {
  app.appView = new app.AppView();
  Backbone.history.start();
});
