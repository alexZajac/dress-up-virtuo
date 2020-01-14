/*eslint-disable space-unary-ops*/
'use strict';

const VIRTUO = (() => { //eslint-disable-line
  const DEDUCTIBLE_PER_DAY = 4;
  const PERCENT_COMMISSION = 0.3;
  const PERCENT_INSURANCE = 0.5;
  const TREASURY_TAX_DAY = 1;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  /**
   * Get car information
   *
   * @return {Object}
   */
  const getCar = () => {
    return {
      'name': document.querySelector('#js-carName').value,
      'pricePerDay': document.querySelector('#js-priceDay').value,
      'pricePerKm': document.querySelector('#js-priceKm').value
    };
  };

  /**
   * Number of rental days from begin and end date
   *
   * @param  {Date} begin
   * @param  {Date} end
   * @return {Integer}
   */
  var getDays = (begin, end) => {
    const beginMs = new Date(begin).getTime();
    const endMs = new Date(end).getTime();

    return Math.floor(Math.abs(endMs - beginMs) / MS_PER_DAY) + 1;
  };

  /**
   * Get discount percent according rental days
   *
   * @param  {Number} days
   * @return {Number}
   */
  const discount = days => {
    if (days > 10) {
      return 0.5;
    }

    if (days > 4) {
      return 0.7;
    }

    if (days > 1) {
      return 0.9;
    }

    return 1;
  };

  /**
   * Compute rental commission
   *
   * @param  {Number} price
   * @param  {Number} days
   * @return {Object}
   */
  const rentalCommission = (price, days) => {
    const value = parseFloat((price * PERCENT_COMMISSION).toFixed(2));
    const insurance = parseFloat((value * PERCENT_INSURANCE).toFixed(2));
    const treasury = days * TREASURY_TAX_DAY;

    return {
      insurance,
      treasury,
      value,
      'virtuo': parseFloat((value - insurance - treasury).toFixed(2))
    };
  };

  /**
   * Compute the rental price
   *
   * @param  {Object} car
   * @param  {Number} days
   * @param  {Number} distance
   * @return {Number} price
   */
  const rentalPrice = (car, days, distance) => {
    const percent = discount(days);
    const pricePerDay = car.pricePerDay * percent;

    return parseFloat((days * pricePerDay + distance * car.pricePerKm).toFixed(2));
  };

  /**
   * Pay each actors
   *
   * @param  {Object} car
   * @param  {String} distance
   * @param  {String} volume
   * @param  {Boolean} option
   * @return {Object}
   */
  const payActors = (car, begin, end, distance, option) => {
    const days = getDays(begin, end);
    const price = rentalPrice(car, days, distance);
    const commission = rentalCommission(price, days);
    const deductibleOption = DEDUCTIBLE_PER_DAY * days * +option;

    var actors = [{
      'who': 'driver',
      'type': 'debit',
      'amount': price + deductibleOption
    }, {
      'who': 'partner',
      'type': 'credit',
      'amount': price - commission.value
    }, {
      'who': 'insurance',
      'type': 'credit',
      'amount': commission.insurance
    }, {
      'who': 'treasury',
      'type': 'credit',
      'amount': commission.treasury
    }, {
      'who': 'virtuo',
      'type': 'credit',
      'amount': commission.virtuo + deductibleOption
    }];

    return actors;
  };

  return {
    'getCar': getCar,
    'payActors': payActors
  };
})();
