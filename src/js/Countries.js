export class Countries {
  constructor() {
    this.getTotalConfirmedCases();
  }

  async getTotalConfirmedCases() {
    const response = await fetch('https://api.covid19api.com/summary');

    const json = await response.json();
    console.log(json);

    // if (response.ok) {
    //
    //   // console.log(json);
    // } else {
    //   alert(`Ошибка HTTP: ${response.status}`);
    // }
  }
}
