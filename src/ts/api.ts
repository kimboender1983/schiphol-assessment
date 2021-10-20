import { FetchType, Flight, SearchObject } from '../types';

export default {
  getFlights: async (searchObject: SearchObject): Promise<Flight[] | null> => {
    let queryString: string = '';

    if (searchObject.type === FetchType.query) {
      if (searchObject.query.length > 2) {
        queryString = `?airport_like=${searchObject.query}`;
      } else {
        return null;
      }
    }

    // Fetch
    const response: Response = await fetch(
      `http://localhost:3000/flights${queryString}`
    );

    // Return flights
    return await response.json();
  },
};
