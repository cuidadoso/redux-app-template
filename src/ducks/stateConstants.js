import { Map, OrderedMap, Record } from 'immutable';

export const EMPTY_MAP = new Map();
export const EMPTY_ORDERED_MAP = new OrderedMap({});

const PageRecord = Record({
  pageSize: 10,
  pageNumber: 1,
  total: 0
});

const ReducerState = new Record({
  loading: false,
  loaded: false,
  error: null,
  entities: EMPTY_ORDERED_MAP,
  visible: false,
  selected: [],
  filter: EMPTY_MAP,
  sort: EMPTY_MAP,
  pagination: new PageRecord(),
  dictionary: EMPTY_ORDERED_MAP
});

export const INIT_REDUCER_STATE = new ReducerState();
