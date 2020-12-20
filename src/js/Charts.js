import Chart from 'chart.js';
import { Constants } from './Constants';
import { Extra } from './Extra';

class Charts {
  constructor(countries, globalInfo) {
    this.container = 'myChart';
    this.countries = [...countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed)];
    this.globalInfo = globalInfo;
    this.bindButtonsEvens();
    this.indexPositionCountries = 0;
    this.currentCategoryIndex = 2;
    this.update();

    // для примера тип line (в массив можно меньше показателей воткнуть)
    // this.update(
    //   this.countries.slice(6, 12).map((element) => element.totalConfirmed),
    //   this.countries.slice(6, 12).map((element) => element.country),
    //   Constants.TABLES_CATEGORY[1],
    //   'line',
    //   0,
    // );
  }

  update(
    data = this.countries.slice(0, 6).map((element) => element.totalConfirmed),
    labels = this.countries.slice(0, 6).map((element) => element.country),
    label = `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]} (top ${this.indexPositionCountries + 1}-${this.indexPositionCountries + 6})`,
    type = 'bar',
    categoryIndex = 2,
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
              fontColor: Constants.CATEGORY_COLORS[categoryIndex],
              beginAtZero: true,
            },
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
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
      const countCountries = 6;
      if (e.target.classList.contains('container__graphics-button')) {
        this.removeMapButtonActive();
        e.target.classList.add('container__graphics-button_active');

        this.currentCategoryIndex = +(e.target.getAttribute('category-id'));
        Extra.sortCountriesByKeys(
          this.countries,
          Constants.TABLES_KEYS[this.currentCategoryIndex],
        );
        this.indexPositionCountries = 0;
      } else if (e.target.classList.contains('arrow-right')) {
        this.checkOnLastCountries(countCountries);
      } else {
        this.checkOnLastCountries((-1) * countCountries);
      }

      this.update(
        this.countries
          .slice(this.indexPositionCountries, this.indexPositionCountries + countCountries)
          .map((element) => element[Constants.TABLES_KEYS[this.currentCategoryIndex]]),
        this.countries
          .slice(this.indexPositionCountries, this.indexPositionCountries + countCountries)
          .map((element) => element.country),
        `${Constants.TABLES_CATEGORY[this.currentCategoryIndex]} (top ${this.indexPositionCountries + 1}-${this.indexPositionCountries + countCountries})`,
        'bar',
        this.currentCategoryIndex,
      );
    });
  }

  checkOnLastCountries(num) {
    let newIndex = this.indexPositionCountries + num;
    if (newIndex < 0) {
      if (newIndex === num) newIndex = this.countries.length - Math.abs(num);
      else newIndex = 0;
    } else if (newIndex >= this.countries.length) {
      if (newIndex === this.countries.length) newIndex = 0;
      else newIndex = this.countries.length - Math.abs(num);
    }
    this.indexPositionCountries = newIndex;
  }

  removeMapButtonActive() {
    const buttons = document.querySelectorAll('.container__graphics-button');
    buttons.forEach((element) => {
      element.classList.remove('container__graphics-button_active');
    });
  }
}

export default Charts;
