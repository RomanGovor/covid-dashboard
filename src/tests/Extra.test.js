/* eslint-disable no-undef */
import { Extra } from '../js/core/services/Extra';

describe('Extra', () => {
  let mockCountries;
  beforeEach(() => {
    mockCountries = [
      {
        country: 'Finland', totalConfirmed: 7577, totalRecovered: 111, population: 2000000,
      },
      {
        country: 'Andorra', totalConfirmed: 10000, totalRecovered: 200, population: 70000,
      },
      {
        country: 'Kenya', totalConfirmed: 5000, totalRecovered: 300, population: 30000000,
      },
      {
        country: 'Estonia', totalConfirmed: 100, totalRecovered: 10, population: 1500000,
      },
    ];
    return mockCountries;
  });

  test('should init Extra', () => {
    const extra = new Extra();

    expect(typeof extra).toEqual('object');
    expect(extra instanceof Extra).toEqual(true);
    expect(extra.test).toBeTruthy();
  });

  test('should convert number to string and add spaces', () => {
    expect(Extra.convertNum(5)).toEqual('5');
    expect(Extra.convertNum(190)).toEqual('190');
    expect(Extra.convertNum(50242)).toEqual('50 242');
    expect(Extra.convertNum(6622)).toEqual('6 622');
  });

  test('should sort countries by argument', () => {
    expect(Extra.sortCountriesByKeys(mockCountries, 'totalConfirmed')).toEqual(
      [
        {
          country: 'Andorra', totalConfirmed: 10000, totalRecovered: 200, population: 70000,
        },
        {
          country: 'Finland', totalConfirmed: 7577, totalRecovered: 111, population: 2000000,
        },
        {
          country: 'Kenya', totalConfirmed: 5000, totalRecovered: 300, population: 30000000,
        },
        {
          country: 'Estonia', totalConfirmed: 100, totalRecovered: 10, population: 1500000,
        },
      ],
    );
    expect(Extra.sortCountriesByKeys(mockCountries, 'totalRecovered')).toEqual(
      [
        {
          country: 'Kenya', totalConfirmed: 5000, totalRecovered: 300, population: 30000000,
        },
        {
          country: 'Andorra', totalConfirmed: 10000, totalRecovered: 200, population: 70000,
        },
        {
          country: 'Finland', totalConfirmed: 7577, totalRecovered: 111, population: 2000000,
        },
        {
          country: 'Estonia', totalConfirmed: 100, totalRecovered: 10, population: 1500000,
        },
      ],
    );
  });

  test('should calculate the parameter per 100k/population', () => {
    expect(Extra.calculatePer100k(mockCountries[0], 'totalConfirmed')).toEqual('378.8500');
    expect(Extra.calculatePer100k(mockCountries[1], 'totalRecovered')).toEqual('285.7143');
  });

  test('should return key by index from Constants', () => {
    expect(Extra.getKeyByIndex(0)).toEqual('totalDeaths');
    expect(Extra.getKeyByIndex(1)).toEqual('totalRecovered');
    expect(Extra.getKeyByIndex(2)).toEqual('totalConfirmed');
    expect(Extra.getKeyByIndex(3)).toEqual('newDeaths');
    expect(Extra.getKeyByIndex(4)).toEqual('newRecovered');
    expect(Extra.getKeyByIndex(5)).toEqual('newConfirmed');
  });
});
