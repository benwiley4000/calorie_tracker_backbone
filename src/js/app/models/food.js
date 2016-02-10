var app = app || {};

app.Food = Backbone.Model.extend({

  defaults: {
    servingsTable: []
  },

  // TODO: allow parameter(s) for selecting specific time window
  getTotalServings: function () {
    return _.reduce(this.get('servingsTable'), function (memo, entry) {
      return memo + entry.amount;
    }, 0);
  },

  incrementServings: function (amount) {
    if (!isNaN(amount)) {
      // cloning the table before re-writing ensures a change event
      // is fired on write from the parent Collection.
      var servingsTable = this.shallowCopyServingsTable();

      servingsTable.push({
        amount: amount,
        timestamp: new Date()
      });

      this.save({
        servingsTable: servingsTable
      });
    } else {
      console.log('Serving increment value "' + amount + '" is not a number.');
    }
  },

  // the most efficient way to shallow copy an array, if slightly verbose
  shallowCopyServingsTable: function () {
    var servingsTable = this.get('servingsTable');
    var len = servingsTable.length;
    var copy = Array(len);
    for(var i = 0; i < len; i++) {
      copy[i] = servingsTable[i];
    }
    return copy;
  }

});