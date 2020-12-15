import { Extra } from './Extra';
import { Constants } from './Constants';

export class Tables {
  constructor() {
    this.initTotalInfo();
    this.countries = [];
    this.globalInfo = {};
  }

  async initTotalInfo() {
    console.log(document);
    const response1 = await fetch('https://api.covid19api.com/summary');
    const response2 = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;alpha2Code');

    if (response1.ok && response2.ok) {
      const data = await response1.json();
      const population = await response2.json();
      this.getCountriesArray(data, population);
      this.getGlobalInfo(data);
      this.renderTableState(false, Constants.TABLES_KEYS[0]);
      this.renderTableState(true, Constants.TABLES_KEYS[0]);
    } else console.log(`Ошибка HTTP 1 -: ${response1.status}, 2- ${response2.status}`);
  }

  getGlobalInfo(data) {
    this.globalInfo = {
      newConfirmed: data.Global.NewConfirmed,
      totalConfirmed: data.Global.TotalConfirmed,
      newDeaths: data.Global.NewDeaths,
      totalDeaths: data.Global.TotalDeaths,
      newRecovered: data.Global.NewRecovered,
      totalRecovered: data.Global.TotalRecovered,
    };
  }

  renderTotalInfoByKeyInGlobal(key) {
    const global = document.querySelector('.global-num');
    const info = Extra.convertNum(this.globalInfo[key]);
    const mode = this.chooseAdditionMode(key);
    const color = `color-${mode}`;

    const newGlobal = document.createElement('div');
    newGlobal.classList.add('content__number', 'global-num', color);
    newGlobal.textContent = info;
    global.replaceWith(newGlobal);
  }

  renderTableState(isRelative, key) {
    if (this.countries.length !== 0) {
      this.changeTableTitle(isRelative, key);
      this.renderTableListByKey(isRelative, key);
      this.renderSliderTitle(isRelative, key);
    }
  }

  renderSliderTitle(isRelative, key) {
    const ind = Constants.TABLES_KEYS.indexOf(key);
    const newTitle = Constants.TABLES_CATEGORY[ind];
    let sliderTitle;
    if (isRelative) {
      sliderTitle = document.querySelector('.relative-buttons > .slider__title');
    } else {
      sliderTitle = document.querySelector('.global-buttons > .slider__title');
    }
    sliderTitle.textContent = newTitle;
  }

  renderTableListByKey(isRelative, key) {
    const mode = this.chooseAdditionMode(key);
    const color = `color-${mode}`;
    let list;
    let listNum = 0;
    if (isRelative) {
      list = document.querySelector('.relative-list');
      this.updateTemporaryNums(key);
    } else {
      list = document.querySelector('.global-list');
      this.countries = [...Extra.sortCountriesByKeys(this.countries, key)];
    }
    Extra.clearListBySelector(list);

    for (let i = 0; i < this.countries.length; i++) {
      const elem = this.countries[i];
      if (isRelative) listNum = Extra.calculatePer100k(elem, key);
      else listNum = Extra.convertNum(elem[key]);

      const country = document.createElement('span');
      country.classList.add('list__item');
      country.setAttribute('country', elem.slug);
      country.innerHTML = `
          <div class="list__inner-block direction-column">
            <div class="direction-row">
              <div class="list__number ${color}">${listNum}</div>
              <span>&nbsp;</span>
              <div class="list__addition ${mode === 'deaths' ? '' : color}">${mode}</div>
            </div>
            <div class="list__country">${elem.country}</div>
          </div>
        `;
      list.append(country);
    }
  }

  changeTableTitle(isRelative, key) {
    const index = Constants.TABLES_KEYS.indexOf(key);
    const newTitle = Constants.TABLES_CATEGORY[index];
    let title;
    if (isRelative) {
      title = document.querySelector('.relative-title');
    } else {
      title = document.querySelector('.global-title');
      this.renderTotalInfoByKeyInGlobal(key);
    }
    title.textContent = newTitle;
  }

  chooseAdditionMode(key) {
    let mode = '';
    switch (key) {
      case 'newConfirmed':
        mode = 'confirmed';
        break;
      case 'totalConfirmed':
        mode = 'confirmed';
        break;
      case 'newDeaths':
        mode = 'deaths';
        break;
      case 'totalDeaths':
        mode = 'deaths';
        break;
      case 'newRecovered':
        mode = 'recovered';
        break;
      case 'totalRecovered':
        mode = 'recovered';
        break;
      default:
        mode = 'recovered';
        break;
    }
    return mode;
  }

  getCountriesArray(data, population) {
    data.Countries.forEach((elem) => {
      const country = {};
      country.country = elem.Country;
      country.totalConfirmed = elem.TotalConfirmed;
      country.newConfirmed = elem.NewConfirmed;
      country.newDeaths = elem.NewDeaths;
      country.totalDeaths = elem.TotalDeaths;
      country.newRecovered = elem.NewRecovered;
      country.totalRecovered = elem.TotalRecovered;
      country.slug = elem.Slug;
      country.temporaryNum = 0;
      country.population = this.getCountryPopulation(elem.CountryCode, population);
      this.countries.push(country);
    });
  }

  updateTemporaryNums(key) {
    for (let i = 0; i < this.countries.length; i++) {
      this.countries[i].temporaryNum = Extra.calculatePer100k(this.countries[i], key);
    }
    this.countries = [...Extra.sortCountriesByKeys(this.countries, 'temporaryNum')];
  }

  getCountryPopulation(country, population) {
    let pop = 0;
    for (let i = 0; i < population.length; i++) {
      if (population[i].alpha2Code === country) {
        pop = population[i].population;
        break;
      }
    }
    return pop;
  }
}
