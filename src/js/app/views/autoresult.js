var app = app || {};

app.AutoResultView = Backbone.View.extend({

  tagName: 'option',

  render: function () {
    this.$el.attr('value', this.model.get('text'));
    return this;
  }

});
