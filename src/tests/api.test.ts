import API from '../ts/api';
import fetch from 'jest-fetch-mock';
import { FetchType } from '../types';
const data = require('../../flights.json');

beforeEach(() => {
  fetch.resetMocks();
});

describe('API', () => {
  it('is an object', () => {
    expect(typeof API).toBe('object');
  });
  describe('getFlights', () => {
    it('is a member of API', () => {
      expect(API.getFlights).toBeDefined();
    });
    it('is a function', () => {
      expect(typeof API.getFlights).toBe('function');
    });
  });
  describe('When using getFlights', () => {
    it(`Should return ${data.flights.length} results when query is empty string`, async () => {
      const result = await API.getFlights({
        query: '',
        type: FetchType.all,
      });
      expect(result).toHaveLength(data.flights.length);
    });
    it('Should return 2 results when query "sant', async () => {
      const result = await API.getFlights({
        query: 'sant',
        type: FetchType.query,
      });
      expect(result).toHaveLength(2);
    });
  });
});
