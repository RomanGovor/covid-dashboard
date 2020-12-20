import { Countries } from './js/Countries';
import { Tables } from './js/Tables';
import { Constants } from './js/Constants';
import { Extra } from './js/Extra';
import Map from './js/Map';
import { Keyboard } from './js/Keyboard';
import Charts from './js/Charts';

class App {
  constructor() {
    this.TABLES = null;
    this.COUNTRIES = null;
    this.MAP = null;
    this.KEYBOARD = new Keyboard();
    this.CHARTS = null;
    this.countries = [];
    this.globalInfo = {};
    this.initCountries();

    this.globalTableIndex = 0;
    this.relativeTableIndex = 0;
    this.indexActiveCountry = -1;
    this.currentCountry = '';
    this.delegateTableArrows();
    this.delegateCLickOnCountryList();
  }

  async initCountries() {
    const response1 = await fetch('https://api.covid19api.com/summary');
    const response2 = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;alpha2Code');

    if (response1.ok && response2.ok) {
      const data = await response1.json();
      const population = await response2.json();
      this.getCountriesArray(data, population).then(() => {
        this.getGlobalInfo(data);
        this.COUNTRIES = new Countries(this.countries, this.globalInfo);
        this.TABLES = new Tables(this.countries, this.globalInfo);
        this.MAP = new Map(this.countries, this.globalInfo);
        this.CHARTS = new Charts(this.countries, this.globalInfo);
        this.delegateClickOnMarkers();
      });
    } else console.log(`Ошибка HTTP 1 -: ${response1.status}, 2- ${response2.status}`);
  }

  async getCountriesArray(data, population) {
    const response = await fetch('https://corona.lmao.ninja/v2/countries');
    const points = [];
    const pointsCode = [];
    if (response.ok) {
      (await response.json()).forEach((el) => {
        points.push(el.countryInfo);
        pointsCode.push(el.countryInfo.iso2);
      });

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
        country.flag = `https://www.countryflags.io/${elem.CountryCode}/shiny/64.png`;
        country.population = this.getCountryPopulation(elem.CountryCode, population);

        country.сountryCode = elem.CountryCode;
        if (pointsCode.includes(country.сountryCode)) {
          const point = points[pointsCode.indexOf(country.сountryCode)];
          country.сountryCoordinates = [point.lat, point.long];
        } else country.сountryCoordinates = null;
        this.countries.push(country);
      });
    }
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

  delegateTableArrows() {
    const tables = document.querySelector('.container__tables');
    tables.addEventListener('click', (event) => {
      const btn = event.target.closest('button');

      if (!btn || !btn.parentElement.classList.contains('slider')) return;
      const slider = btn.parentElement;

      if (slider.classList.contains('global-buttons')) {
        if (btn.classList.contains('arrow-right')) this.globalTableIndex += 1;
        else this.globalTableIndex -= 1;
        this.globalTableIndex = this.checkOnRangePage(this.globalTableIndex);

        const key = Extra.getKeyByIndex(this.globalTableIndex);
        this.TABLES.renderTableState(false, key, this.currentCountry);
      } else {
        if (btn.classList.contains('arrow-right')) this.relativeTableIndex += 1;
        else this.relativeTableIndex -= 1;
        this.relativeTableIndex = this.checkOnRangePage(this.relativeTableIndex);

        const key = Extra.getKeyByIndex(this.relativeTableIndex);
        this.TABLES.renderTableState(true, key, this.currentCountry);
      }
    });
  }

  delegateCLickOnCountryList() {
    const countriesList = document.querySelector('.counties-list');
    countriesList.addEventListener('click', (event) => {
      const span = event.target.closest('span');

      if (!span || !span.classList.contains('list__item')) return;
      this.indexActiveCountry = this.COUNTRIES
        .changeIndexActiveCountry(countriesList, span, this.indexActiveCountry);
      this.currentCountry = this.COUNTRIES
        .changeNameActiveCountry(span, this.indexActiveCountry);

      const keyRelative = Extra.getKeyByIndex(this.relativeTableIndex);
      const keyGlobal = Extra.getKeyByIndex(this.globalTableIndex);
      this.TABLES.renderTableState(true, keyRelative, this.currentCountry);
      this.TABLES.renderTableState(false, keyGlobal, this.currentCountry);
    });

    countriesList.addEventListener('click', () => {
      if (this.COUNTRIES.countries) {
        const coords = this.COUNTRIES.countries[this.indexActiveCountry].сountryCoordinates;
        if (coords) this.MAP.move(coords);
      }
    });
  }

  delegateClickOnMarkers() {
    const containerMarkers = document.querySelector('.leaflet-marker-pane');
    containerMarkers.addEventListener('click', (event) => {
      const img = event.target.closest('img');

      if (!img || !img.hasAttribute('country')) return;

      this.indexActiveCountry = this.COUNTRIES
        .removeAttrActiveCountry(this.indexActiveCountry);
      this.currentCountry = this.COUNTRIES
        .setNameActiveCountryByMarker(img);

      const keyRelative = Extra.getKeyByIndex(this.relativeTableIndex);
      const keyGlobal = Extra.getKeyByIndex(this.globalTableIndex);
      this.TABLES.renderTableState(true, keyRelative, this.currentCountry);
      this.TABLES.renderTableState(false, keyGlobal, this.currentCountry);
    });
  }

  checkOnRangePage(num) {
    if (num >= Constants.MAX_COUNT_PAGES_TABLES) return 0;
    if (num < 0) return Constants.MAX_COUNT_PAGES_TABLES - 1;
    return num;
  }
}

const APP = new App();
