import Chart from 'chart.js';
import { Constants } from './Constants';
import { Extra } from './Extra';

class Charts {
  constructor(countries, globalInfo) {
    this.container = 'myChart';
    this.countries = [...countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed)];
    this.globalInfo = globalInfo;
    this.bindButtonsEvens();
    this.init();

    // для примера тип line (в массив можно меньше показателей воткнуть)
    this.update(
      this.countries.slice(6, 12).map((element) => element.totalConfirmed),
      this.countries.slice(6, 12).map((element) => element.country),
      Constants.TABLES_CATEGORY[1],
      'line',
    );
  }

  init(
    data = this.countries.slice(0, 6).map((element) => element.totalConfirmed),
    labels = this.countries.slice(0, 6).map((element) => element.country),
    label = 'Total confirmed',
    type = 'bar',
  ) {
    const chartConfig = {
      type,
      data: {
        labels,
        datasets: [{
          // label,
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
              beginAtZero: true,
            },
          }],
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `${label}`,
          fontColor: '#F03E3D',
        },
      },
    };

    this.chart = new Chart(this.container, chartConfig);
  }

  update(
    data = this.countries.slice(0, 6).map((element) => element.totalConfirmed),
    labels = this.countries.slice(0, 6).map((element) => element.country),
    label = 'Total confirmed',
    type = 'bar',
  ) {
    // this.chart.update();

    const chartConfig = {
      type,
      data: {
        labels,
        datasets: [{
          // label,
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
              beginAtZero: true,
            },
          }],
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `${label}`,
          // eslint-disable-next-line no-nested-ternary
          fontColor: label.match('onfirmed') ? '#F03E3D'
            : label.match('eaths') ? 'white' : '#70A800',
        },
      },
    };

    this.chart.destroy();
    this.chart = new Chart(this.container, chartConfig);
  }

  bindButtonsEvens() {
    const list = document.querySelector('.container__graphics-buttons');
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('container__graphics-button')) {
        this.removeMapButtonActive();
        e.target.classList.add('container__graphics-button_active');
      }

      if (e.target.classList.contains('js-graphics-confirmed-button')) {
        this.countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed);
        this.update();
      } else if (e.target.classList.contains('js-graphics-recovered-button')) {
        this.countries.sort((a, b) => b.totalRecovered - a.totalRecovered);
        this.update(
          this.countries.slice(0, 6).map((element) => element.totalRecovered),
          this.countries.slice(0, 6).map((element) => element.country),
          'Recovered',
        );
      } else if (e.target.classList.contains('js-graphics-deaths-button')) {
        this.countries.sort((a, b) => b.totalDeaths - a.totalDeaths);
        this.update(
          this.countries.slice(0, 6).map((element) => element.totalDeaths),
          this.countries.slice(0, 6).map((element) => element.country),
          'Deaths',
        );
      } else if (e.target.classList.contains('js-graphics-daily-confirmed-button')) {
        Extra.sortCountriesByKeys(this.countries, Constants.TABLES_KEYS[5]);
        this.update(
          this.countries.slice(0, 6).map((element) => element.newConfirmed),
          this.countries.slice(0, 6).map((element) => element.country),
          'Daily Confirmed',
        );
      } else if (e.target.classList.contains('js-graphics-daily-recovered-button')) {
        Extra.sortCountriesByKeys(this.countries, Constants.TABLES_KEYS[4]);
        this.update(
          this.countries.slice(0, 6).map((element) => element.newRecovered),
          this.countries.slice(0, 6).map((element) => element.country),
          'Daily Recovered',
        );
      } else if (e.target.classList.contains('js-graphics-daily-deaths-button')) {
        Extra.sortCountriesByKeys(this.countries, Constants.TABLES_KEYS[3]);
        this.update(
          this.countries.slice(0, 6).map((element) => element.newDeaths),
          this.countries.slice(0, 6).map((element) => element.country),
          'Daily Deaths',
        );
      }
    });
  }

  removeMapButtonActive() {
    const buttons = document.querySelectorAll('.container__graphics-button');
    buttons.forEach((element) => {
      element.classList.remove('container__graphics-button_active');
    });
  }
}

export default Charts;
