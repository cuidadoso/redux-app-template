import { fromJS } from 'immutable';
import { ORDER } from '../util/constatns';

export function loadAll(URL, LOAD_ALL, filter, sort, page, size) {
  let urlParams = '';
  if ((filter && filter.size > 0) || (sort && sort.size > 0) || page || size)
    urlParams = '?';
  if (filter && filter.size > 0) {
    fromJS(filter).forEach(
      (v, k) =>
        (urlParams = urlParams
          .concat(k)
          .concat('=')
          .concat(v)
          .concat('&'))
    );
    urlParams = urlParams.slice(0, -1);
  }
  if (sort && sort.size > 0) {
    urlParams =
      urlParams === '?'
        ? urlParams.concat('sort=')
        : urlParams.concat('&sort=');
    fromJS(sort).forEach((v, k) => {
      if (v === ORDER.ascend)
        urlParams = urlParams
          .concat('+')
          .concat(k)
          .concat(',');
      if (v === ORDER.descend)
        urlParams = urlParams
          .concat('-')
          .concat(k)
          .concat(',');
    });
    urlParams = urlParams.slice(0, -1);
  }

  if (page) {
    urlParams = urlParams.concat('&offset=').concat(page - 1);
  }

  if (size) {
    urlParams = urlParams.concat('&limit=').concat(size);
  }

  return {
    type: LOAD_ALL,
    callApi: `${URL}${urlParams}`
  };
}

export function add(URL, ADD, entity) {
  return {
    type: ADD,
    callApi: URL,
    method: 'POST',
    payload: {
      ...entity
    }
  };
}

export function update(URL, UPDATE, entity) {
  return {
    type: UPDATE,
    callApi: `${URL}/${entity.id}`,
    method: 'PUT',
    payload: {
      ...entity
    }
  };
}

export function del(URL, DELETE, entity) {
  return {
    type: DELETE,
    callApi: `${URL}/${entity.get('id')}`,
    method: 'DELETE'
  };
}

export function delAll(URL, DELETE, entities) {
  const ids = entities.map((e) => {
    return e.get('id');
  });
  return {
    type: DELETE,
    callApi: URL,
    method: 'DELETE',
    payload: {
      ids: ids
    }
  };
}
