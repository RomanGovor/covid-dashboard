import Chart from 'chart.js';
import { Constants } from './Constants';

class Charts {
  constructor(countries, globalInfo) {
    this.container = 'myChart';
    this.countries = [...countries.sort((a, b) => b.totalConfirmed - a.totalConfirmed)];
    this.globalInfo = globalInfo;

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
    data,
    labels,
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
          fontColor: '#F03E3D',
        },
      },
    };

    this.chart.destroy();
    // this.chart.clear();
    // this.chart.update(chartConfig);
    // this.chart.render(chartConfig);
    this.chart = new Chart(this.container, chartConfig);
  }
}

export default Charts;
