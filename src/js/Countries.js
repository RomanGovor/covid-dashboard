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
    this.sortCountries();
    this.renderCountriesList();
  }

  renderCountriesList() {
    if (this.countries.length !== 0) {
      const countriesList = document.querySelector('.counties-list');
      this.clearCountriesList();

      for (let i = 0; i < this.countries.length; i++) {
        const elem = this.countries[i];
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
      }
    }
  }

  changeIndexActiveCountry(selector, country, oldIndex) {
    if (oldIndex !== -1) selector.children[oldIndex].classList.remove('active-item');
    let newIndex = parseInt(country.getAttribute('country-id'), 10);
    if (newIndex !== oldIndex) selector.children[newIndex].classList.add('active-item');
    else newIndex = -1;
    return newIndex;
  }

  changeNameActiveCountry(country, index) {
    if (index !== -1) return country.getAttribute('country');
    return '';
  }

  clearCountriesList() {
    const countriesList = document.querySelector('.counties-list');
    while (countriesList.childElementCount !== 0) {
      countriesList.removeChild(countriesList.firstChild);
    }
  }

  sortCountries() {
    this.countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed);
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
