export class Countries {
  constructor() {
    this.getTotalConfirmedCases();
    this.countries = [];
    this.renderCountriesList();
  }

  async getTotalConfirmedCases() {
    const response = await fetch('https://api.covid19api.com/summary');
    if (response.ok) {
      const data = await response.json();
      this.renderGlobalCases(data);
      this.getCountriesArray(data);
      this.renderCountriesList();
    } else {
      alert(`Ошибка HTTP: ${response.status}`);
    }
  }

  renderCountriesList() {
    if (this.countries.length !== 0) {
      const countriesList = document.querySelector('.counties-list');
      this.clearCountriesList();

      for (let i = 0; i < this.countries.length; i++) {
        const elem = this.countries[i];
        const country = document.createElement('span');
        country.classList.add('list__item');
        country.setAttribute('country', elem.slug);
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

  clearCountriesList() {
    const countriesList = document.querySelector('.counties-list');
    while (countriesList.childElementCount !== 0) {
      countriesList.removeChild(countriesList.firstChild);
    }
  }

  getCountriesArray(data) {
    data.Countries.forEach((elem) => {
      const country = {};
      country.country = elem.Country;
      country.totalConfirmed = elem.TotalConfirmed + elem.NewConfirmed;
      country.slug = elem.Slug;
      country.flag = `https://www.countryflags.io/${elem.CountryCode}/shiny/64.png`;
      this.countries.push(country);
    });
    this.sortCountries();
    console.log(this.countries);
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
    console.log(data.Global.TotalConfirmed);
    return data.Global.TotalConfirmed + data.Global.TotalDeaths;
  }
}
