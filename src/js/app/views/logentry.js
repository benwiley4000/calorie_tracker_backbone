var app = app || {};

app.LogEntryView = Backbone.View.extend({

  el: '#log-entry-form-container',

  template: _.template($('#log-entry-form-template').html()),

  events: {
    'click': 'preventClose',
    'click #log-entry-form-submit': 'submit',
    'click #log-entry-form-delete': 'delete',
    'click #log-entry-form-close': 'close',
    'change #food-amount-input': 'handleFoodAmountChange',
    'change #food-unit-select': 'handleFoodUnitChange',
    'input #food-amount-input': 'handleFoodAmountInput',
    'input #food-consumption-date-input': 'handleDateInput'
  },

  initialize: function () {
    this.$logEntryForm = this.$('#log-entry-form');

    this.action = null;
    this.entry = null;
    this.food = null;
    this.foodAmount = null;
    this.disableServings = false;
    this.selectedUnit = 'kcal';
    this.errors = {
      foodAmount: false,
      date: false
    };
  },

  open: function (options) {
    var action = options.action;
    var food;

    if (action === 'new') {

      this.entry = null;
      food = this.food = options.food;
      this.foodAmount = null;

    } else if (action === 'edit') {

      var entry = this.entry = options.entry;
      food = this.food = app.foods.get(entry.get('resourceId'));
      var kcalCount = entry.get('kcalCount');
      if (this.selectedUnit === 'serving') {
        this.foodAmount = kcalCount / food.get('nutrient_value');
      } else {
        this.foodAmount = kcalCount;
      }

    } else {

      throw new Error('Unrecognized log entry form action: ' + options.action || 'undefined');

    }

    this.action = action;
    if (food.get('serving_qty') && food.get('nutrient_value') && food.get('nutrient_uom') === 'kcal') {
      this.disableServings = false;
    } else {
      this.disableServings = true;
      var foodAmount = this.foodAmount;
      if (foodAmount && this.selectedUnit === 'serving') {
        this.selectedUnit = 'kcal';
        this.foodAmount = foodAmount * food.get('nutrient_value');
      }
    }
    this.render();
  },

  render: function () {
    var entry = this.entry;
    var food = this.food;

    var props = {
      itemName: food.get('item_name'),
      action: entry ? 'edit' : 'new',
      selectedUnit: this.selectedUnit,
      disableServings: this.disableServings,
      servingQty: food.get('serving_qty'),
      servingUom: food.get('serving_uom'),
      date: entry ? new Date(entry.get('date')) : new Date()
    };

    this.$logEntryForm.html(this.template(props));
    this.renderFoodAmountInput();
    this.renderServingSize();
    this.renderErrors();
  },

  renderFoodAmountInput: function () {
    var foodAmount = this.foodAmount;
    var displayAmount = foodAmount ? parseFloat(foodAmount).toFixed(1) : '';
    this.$('#food-amount-input').val(displayAmount);
  },

  renderServingSize: function () {
    var $servingSizeNotice = this.$('#serving-size-notice');
    if (this.selectedUnit === 'serving') {
      $servingSizeNotice.removeClass('hidden');
      return;
    }
    $servingSizeNotice.addClass('hidden');
  },

  renderErrors: function () {
    var errors = this.errors;

    var $logEntryError = this.$('#log-entry-error');
    if (errors.foodAmount || errors.date) {
      $logEntryError.removeClass('hidden');
    } else {
      $logEntryError.addClass('hidden');
    }
    
    var $foodAmountInput = this.$('#food-amount-input');
    var $dateInput = this.$('#food-consumption-date-input');
    if (errors.foodAmount) {
      $foodAmountInput.addClass('has-error');
    } else {
      $foodAmountInput.removeClass('has-error');
    }
    if (errors.date) {
      $dateInput.addClass('has-error');
    } else {
      $dateInput.removeClass('has-error');
    }
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

    var errors = this.errors = {
      foodAmount: !foodAmountInput.checkValidity(),
      date: !dateInput.checkValidity()
    };

    if (errors.foodAmount || errors.date) {
      this.renderErrors();
      return;
    }

    var food = this.food;

    var foodAmount = this.foodAmount;
    var foodUnit = foodUnitSelect.value;
    var kcalCount;
    if (foodUnit === 'serving') {
      kcalCount = foodAmount * food.get('nutrient_value');
    } else {
      kcalCount = foodAmount;
    }

    var dateInputData = dateInput.value.split('-');
    var date = new Date();
    date.setYear(dateInputData[0]);
    date.setMonth(dateInputData[1] - 1); // month setter is zero-based!
    date.setDate(dateInputData[2]);

    var entry = this.entry;
    if (entry) {
      entry.setCalorieCount(kcalCount);
      entry.setDate(date);
    } else {
      app.kcalLog.create({
        resourceId: food.get('resource_id'),
        kcalCount: kcalCount,
        date: date
      });
    }

    food.trigger('logupdate');

    this.close();

    // create successful save message notification
  },

  delete: function () {
    var entry = this.entry;
    var message =
      'Are you sure you want to delete an entry for ' +
      entry.get('kcalCount') + ' Calories on ' +
      new Date(entry.get('date')).toDateString() + '?';
    if (window.confirm(message)) {
      entry.destroy();
      this.close();

      // create successful delete message notification
    }
  },

  close: function () {
    app.appView.trigger('closelogentry');
  },

  handleFoodAmountChange: function (e) {
    this.foodAmount = parseFloat(e.target.value);
  },

  handleFoodUnitChange: function (e) {
    var selectedUnit = this.selectedUnit = e.target.value;
    if (selectedUnit === 'serving' && this.disableServings) {
      this.selectedUnit = 'kcal';
      return;
    }

    var food = this.food;

    var nutrientValue = food.get('nutrient_value');

    if (!food.get('serving_qty') || !nutrientValue) {
      /* we don't have enough information to convert,
       * so we'll clear the value and replace it with
       * the stored kcal value if appropriate/available.
       */
      var entry = this.entry;
      if (entry && selectedUnit === 'kcal') {
        this.foodAmount = entry.get('kcalCount');
      } else {
        this.foodAmount = null;
      }
    } else {
      // convert value appropriately
      var foodAmount = this.foodAmount;
      if (!isNaN(foodAmount)) {
        if (selectedUnit === 'serving') {
          this.foodAmount = foodAmount / nutrientValue;
        } else {
          this.foodAmount = foodAmount * nutrientValue;
        }
      }
    }

    this.renderFoodAmountInput();
    this.renderServingSize();
  },

  handleFoodAmountInput: function (e) {
    var errors = this.errors;
    if (errors.foodAmount && e.target.checkValidity()) {
      errors.foodAmount = false;
      this.renderErrors();
    }
  },

  handleDateInput: function (e) {
    var errors = this.errors;
    if (errors.date && e.target.checkValidity()) {
      errors.date = false;
      this.renderErrors();
    }
  }

});
