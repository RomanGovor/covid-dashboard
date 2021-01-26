import { Extra } from '../core/services/Extra';

export class Countries {
  constructor(countries, globalInfo) {
    this.countries = [...countries];
    this.globalInfo = globalInfo;
    this.getTotalConfirmedCases();
    this.renderCountriesList();
    this.searchCountry();
  }

  searchCountry() {
    const input = document.querySelector('#textarea');
    const keyboard = document.querySelector('.keyboard');

    input.addEventListener('input', () => {
      this.iterateOverCountries(input.value);
    });
    keyboard.addEventListener('click', () => {
      this.iterateOverCountries(input.value);
    });
  }

  iterateOverCountries(str) {
    const countriesList = document.querySelector('.counties-list');
    const countries = countriesList.querySelectorAll('.list__country');
    countries.forEach((elem) => {
      if (elem.textContent.toLowerCase().includes(str.toLowerCase())) {
        elem.parentNode.parentNode.classList.remove('none');
      } else {
        elem.parentNode.parentNode.classList.add('none');
      }
    });
  }

  getTotalConfirmedCases() {
    this.renderGlobalCases(this.globalInfo);
    this.countries = Extra.sortCountriesByKeys(this.countries, 'totalConfirmed');
    this.renderCountriesList();
  }

  renderCountriesList() {
    if (this.countries.length !== 0) {
      const countriesList = document.querySelector('.counties-list');
      this.clearCountriesList();

      this.countries.forEach((elem, i) => {
        const country = document.createElement('span');
        country.classList.add('list__item', 'list__interactive');
        country.setAttribute('country', elem.slug);
        country.setAttribute('country-id', i.toString());
        country.innerHTML = `
         <div class="list__inner-block">
           <div class="list__number">${this.convertNum(elem.totalConfirmed)}</div>
           <span>&nbsp;</span>
           <div class="list__country">${elem.country}</div>
           <span>&nbsp;</span>
           <img class="list__flag" src="${elem.flag}">
         </div>
      `;

        countriesList.append(country);
      });
    }
  }

  findFullName(country) {
    let fullName = '';
    for (let i = 0; i < this.countries.length; i++) {
      if (country.slug === country) {
        fullName = country.country;
        break;
      }
    }
    return fullName;
  }

  changeIndexActiveCountry(selector, country, oldIndex) {
    if (oldIndex !== -1) selector.children[oldIndex].classList.remove('active-item');
    let newIndex = parseInt(country.getAttribute('country-id'), 10);
    if (newIndex !== oldIndex) selector.children[newIndex].classList.add('active-item');
    else newIndex = -1;
    return newIndex;
  }

  removeAttrActiveCountry(index) {
    const countries = document.querySelector('.counties-list');
    if (index !== -1) countries.children[index].classList.remove('active-item');
    return -1;
  }

  changeNameActiveCountry(country, index) {
    if (index !== -1) return country.getAttribute('country');
    return '';
  }

  setNameActiveCountryByMarker(marker) {
    return marker.getAttribute('country');
  }

  clearCountriesList() {
    const countriesList = document.querySelector('.counties-list');
    while (countriesList.childElementCount !== 0) {
      countriesList.removeChild(countriesList.firstChild);
    }
  }

  convertNum(num) {
    return `${num}`.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  }

  renderGlobalCases(data) {
    const globalCases = document.querySelector('.global-cases');
    const cases = this.convertNum(this.getGlobalCases(data));
    globalCases.textContent = cases;
  }

  getGlobalCases(data) {
    return data.totalConfirmed;
  }
}
