export interface Flight {
  flightIdentifier: string;
  flightNumber: string;
  airport: string;
  expectedTime: string;
  originalTime: string;
  url: string;
  score: string;
}

export enum View {
  cards,
  table,
}

export enum FetchType {
  query,
  all,
}

export interface SearchObject {
  query: string;
  type: FetchType;
}
