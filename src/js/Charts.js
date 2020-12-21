import Chart from 'chart.js';
import { Constants } from './Constants';
import { Extra } from './Extra';
import { Countries } from './Countries';
import { Tables } from './Tables';
import Map from './Map';

class Charts {
  constructor(countries, globalInfo) {
    this.globalTimelineData = [];
    this.timelineCountry = [];
    this.getTimelineData();
    this.container = 'myChart';
    this.currentActiveCountry = '';

    this.countries = [...countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed)];
    this.globalInfo = globalInfo;

    this.bindButtonsEvens();
    this.indexPositionCountries = 0;
    this.currentCategoryIndex = 2;
  }

  async getTimelineData() {
    const response = await fetch('https://covid19-api.org/api/timeline');
    if (response.ok) {
      const data = await response.json();
      this.getGlobalTimelineArray(data);
      this.update();
    } else console.log(`Ошибка HTTP 1 -: ${response.status}`);
  }

  getGlobalTimelineArray(data) {
    data.forEach((elem) => {
      const day = {};
      day.totalConfirmed = elem.total_cases;
      day.totalDeaths = elem.total_deaths;
      day.totalRecovered = elem.total_recovered;
      day.dateUpdate = elem.last_update.replace('-', '/');
      this.globalTimelineData.push(day);
    });
    this.globalTimelineData.reverse();
  }

  async updateByCountry(country, fullName) {
    this.currentActiveCountry = fullName;

    if (fullName !== '') {
      const response = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=100`);
      if (response.ok) {
        const data = await response.json();
        this.updateTimelineInfoByCountry(data);
        this.checkOnActiveCountry();
      } else console.log(`Ошибка HTTP 1 -: ${response.status}`);
    } else this.checkOnActiveCountry();
  }

  updateTimelineInfoByCountry(data) {
    this.timelineCountry = [];
    const keys = Object.keys(data.timeline.cases);

    for (let i = 0; i < keys.length; i++) {
      const day = {};
      day.totalConfirmed = data.timeline.cases[keys[i]];
      day.totalDeaths = data.timeline.deaths[keys[i]];
      day.totalRecovered = data.timeline.recovered[keys[i]];
      day.dateUpdate = keys[i];
      this.timelineCountry.push(day);
    }
  }

  // update(
  //   data = this.countries.slice(0, 6).map((element) => element.totalConfirmed),
  //   labels = this.countries.slice(0, 6).map((element) => element.country),
  //   label = `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]} +
  //   (top ${this.indexPositionCountries + 1}-${this.indexPositionCountries + 6})`,
  //   type = 'bar',
  //   categoryIndex = 2,
  // ) {
  //   const chartConfig = {
  //     type,
  //     data: {
  //       labels,
  //       datasets: [{
  //         // label,
  //         data,
  //         backgroundColor: Constants.CHAR_BG_COLOR,
  //         borderColor: Constants.CHAR_BORDER_COLOR,
  //         borderWidth: 1,
  //       }],
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             fontColor: Constants.CATEGORY_COLORS[categoryIndex],
  //             beginAtZero: true,
  //           },
  //         }],
  //         xAxes: [{
  //           ticks: {
  //             fontColor: 'white',
  //           },
  //         }],
  //       },
  //       legend: {
  //         display: false,
  //         labels: {
  //           fontColor: Constants.CATEGORY_COLORS[this.currentCategoryIndex],
  //         },
  //       },
  //       title: {
  //         display: true,
  //         text: `${label}`,
  //         fontColor: Constants.CATEGORY_COLORS[categoryIndex],
  //       },
  //     },
  //   };
  //
  //   if (this.chart) this.chart.destroy();
  //   this.chart = new Chart(this.container, chartConfig);
  // }

  update(
    data = this.globalTimelineData.slice(-100)
      .map((element) => element.totalConfirmed),
    labels = this.globalTimelineData.slice(-100)
      .map((element) => element.dateUpdate.slice(0, 10)),
    label = `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]}`,
    type = 'line',
    categoryIndex = 2,
  ) {
    const chartConfig = {
      type,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: Constants.CHAR_BG_COLOR,
          borderColor: Constants.CHAR_BORDER_COLOR,
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              fontColor: Constants.CATEGORY_COLORS[categoryIndex],
              beginAtZero: true,
            },
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              fontSize: 6,
            },
          }],
        },
        legend: {
          display: false,
          labels: {
            fontColor: Constants.CATEGORY_COLORS[this.currentCategoryIndex],
          },
        },
        title: {
          display: true,
          text: `${label}`,
          fontColor: Constants.CATEGORY_COLORS[categoryIndex],
        },
      },
    };

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.container, chartConfig);
  }

  bindButtonsEvens() {
    const list = document.querySelector('.container__graphics-buttons');
    list.addEventListener('click', (e) => {
      // const countCountries = 6;
      if (e.target.classList.contains('container__graphics-button')) {
        this.removeMapButtonActive();
        e.target.classList.add('container__graphics-button_active');

        this.currentCategoryIndex = +(e.target.getAttribute('category-id'));
        // Extra.sortCountriesByKeys(
        //   this.countries,
        //   Constants.TABLES_KEYS[this.currentCategoryIndex],
        // );
        // this.indexPositionCountries = 0;
      }
      // else if (e.target.classList.contains('arrow-right')) {
      //   this.checkOnLastCountries(countCountries);
      // } else {
      //   this.checkOnLastCountries((-1) * countCountries);
      // }

      // this.update(
      //   this.countries
      //     .slice(this.indexPositionCountries, this.indexPositionCountries + countCountries)
      //     .map((element) => element[Constants.TABLES_KEYS[this.currentCategoryIndex]]),
      //   this.countries
      //     .slice(this.indexPositionCountries, this.indexPositionCountries + countCountries)
      //     .map((element) => element.country),
      //   `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]}
      //   + (top ${this.indexPositionCountries + 1}-
      //   + ${this.indexPositionCountries + countCountries})`,
      //   'line',
      //   this.currentCategoryIndex,
      // );

      this.checkOnActiveCountry();
    });
  }

  checkOnActiveCountry() {
    if (this.currentActiveCountry === '') {
      this.update(
        this.globalTimelineData.slice(-100)
          .map((element) => element[Constants.TABLES_KEYS[this.currentCategoryIndex]]),
        this.globalTimelineData.slice(-100)
          .map((element) => element.dateUpdate.slice(0, 10)),
        `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]}`,
        'line',
        this.currentCategoryIndex,
      );
    } else {
      this.update(
        this.timelineCountry
          .map((element) => element[Constants.TABLES_KEYS[this.currentCategoryIndex]]),
        this.timelineCountry.map((element) => element.dateUpdate),
        `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]} ( ${this.currentActiveCountry} )`,
        'line',
        this.currentCategoryIndex,
      );
    }
  }

  // checkOnLastCountries(num) {
  //   let newIndex = this.indexPositionCountries + num;
  //   if (newIndex < 0) {
  //     if (newIndex === num) newIndex = this.countries.length - Math.abs(num);
  //     else newIndex = 0;
  //   } else if (newIndex >= this.countries.length) {
  //     if (newIndex === this.countries.length) newIndex = 0;
  //     else newIndex = this.countries.length - Math.abs(num);
  //   }
  //   this.indexPositionCountries = newIndex;
  // }

  removeMapButtonActive() {
    const buttons = document.querySelectorAll('.container__graphics-button');
    buttons.forEach((element) => {
      element.classList.remove('container__graphics-button_active');
    });
  }
}

export default Charts;
