var app = app || {};

app.AutoResultView = Backbone.View.extend({

  tagName: 'option',

  render: function () {
    // we  use this.model.attributes instead of the getter because
    // we want to deliver autocomplete results as swiftly as possible
    this.$el.attr('value', this.model.attributes.text);
    return this;
  }

});