import { Constants } from '../Constants';

export class Extra {
  constructor() {
    this.test = true;
  }

  static convertNum(num) {
    return `${num}`.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  }

  static sortCountriesByKeys(countries, key) {
    return countries.sort((a, b) => b[key] - a[key]);
  }

  static clearListBySelector(selector) {
    while (selector.childElementCount !== 0) {
      selector.removeChild(selector.firstChild);
    }
  }

  static calculatePer100k(country, key) {
    return ((country[key] / country.population) * 100000).toFixed(4);
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static getKeyByIndex(index) {
    return Constants.TABLES_KEYS[index];
  }
}
