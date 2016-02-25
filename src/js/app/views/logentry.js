var app = app || {};

app.LogEntryView = Backbone.View.extend({

  el: '#log-entry-form-container',

  template: _.template($('#log-entry-form-template').html()),

  events: {
    'click': 'preventClose',
    'click #log-entry-form-submit': 'submit',
    'click #log-entry-form-delete': 'delete',
    'click #log-entry-form-close': 'close',
    'change #food-unit-select': 'convertAmount'
  },

  initialize: function () {
    this.$logEntryForm = this.$('#log-entry-form');

    this.action = null;
    this.entry = null;
    this.food = null;
  },

  open: function (options) {
    var action = options.action;

    if (action === 'new') {

      this.entry = null;
      this.food = options.food;

    } else if (action === 'edit') {

      var entry = this.entry = options.entry;
      this.food = app.foods.get(entry.get('resource_id'));

    } else {

      throw new Error('Unrecognized log entry form action: ' + options.action || 'undefined');

    }

    this.action = action;
    this.render();
  },

  render: function () {
    var entry = this.entry;
    var food = this.food;

    var props = {
      itemName: food.get('item_name'),
      action: entry ? 'edit' : 'new',
      kcalCount: entry ? entry.get('kcalCount') : null,
      date: entry ? entry.get('date') : new Date()
    };

    this.$logEntryForm.html(this.template(props));
  },

  /* keeps appView from closing the log entry form in
   * response to a random click inside the actual form
   */
  preventClose: function (e) {
    e.stopPropagation();
  },

  submit: function () {
    var foodAmountInput = this.$('#food-amount-input').get(0);
    var foodUnitSelect = this.$('#food-unit-select').get(0);
    var dateInput = this.$('#food-consumption-date-input').get(0);

    if (foodAmountInput.checkValidity() && dateInput.checkValidity()) {
      // submit
    } else {
      // create error message notification
    }
  },

  delete: function () {
    var entry = this.entry;
    var message =
      'Are you sure you want to delete an entry for ' +
      entry.get('kcalCount') + ' on ' +
      entry.get('date').toDateString() + '?';
    if (window.confirm(message)) {
      app.log.remove(entry);
      this.close();
    }
  },

  close: function () {
    app.appView.trigger('closeLogEntry');
  },

  convertAmount: function () {
    var $foodAmountInput = this.$('#food-amount-input');
    var currentlyEnteredAmount = $foodAmountInput.val();
    var selectedUnit = this.$('#food-unit-select').val();
    var servingUom = this.food.get('serving_uom');

    if (servingUom !== 'kcal') {
      /* we don't have enough information to convert,
       * so we'll clear the value and replace it with
       * the stored kcal value if appropriate/available.
       */
      var entry = this.entry;
      if (entry && selectedUnit === 'kcal') {
        $foodAmountInput.val(entry.get('kcalCount'));
      } else {
        $foodAmountInput.val('');
      }
      return;
    }

    var servingQty = this.food.get('serving_qty');
    if (selectedUnit === 'serving') {
      $foodAmountInput.val(currentlyEnteredAmount / servingQty);
    } else {
      $foodAmountInput.val(currentlyEnteredAmount * servingQty);
    }
  }

});
