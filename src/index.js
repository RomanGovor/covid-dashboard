import { Countries } from './js/Countries';
import { Tables } from './js/Tables';
import { Constants } from './js/Constants';
import { Extra } from './js/Extra';

class App {
  constructor() {
    new Countries();
    this.TABLES = new Tables();
    this.globalTableIndex = 0;
    this.relativeTableIndex = 0;
    this.delegateTableArrows();
  }

  async delegateTableArrows() {
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
        this.TABLES.renderTableState(false, key);
      } else {
        if (btn.classList.contains('arrow-right')) this.relativeTableIndex += 1;
        else this.relativeTableIndex -= 1;
        this.relativeTableIndex = this.checkOnRangePage(this.relativeTableIndex);

        const key = Extra.getKeyByIndex(this.relativeTableIndex);
        this.TABLES.renderTableState(true, key);
      }
    });
  }

  checkOnRangePage(num) {
    if (num >= Constants.MAX_COUNT_PAGES_TABLES) return 0;
    if (num < 0) return Constants.MAX_COUNT_PAGES_TABLES - 1;
    return num;
  }
}

const APP = new App();
