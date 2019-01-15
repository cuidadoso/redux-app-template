const logout = () => {
  console.log('---', 'Log out function');
};

/**
 * Свое базовое  исключение
 * @param message Сообщение
 * @param name Имя исключения. Вызывать конструктор без этого параметра, нужно значение
 * по умолчанию. Переопределить в наследнике.
 * @constructor
 */
function FetchError(
  message = FetchError.prototype.message,
  name = 'FetchError'
) {
  Error.call(this);
  this.name = name;
  this.message = message;
  this.stack = new Error().stack;
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.message = 'Server error loading data! ';

function HttpError(code, response, message, name = 'HttpError') {
  FetchError.apply(this, [message, name]);
  this.code = code;
  this.response = response;
}
HttpError.prototype = Object.create(FetchError.prototype);

/**
 * Ошибка 401 - Unauthorized
 * @param response
 * @param message
 * @param name
 * @constructor
 */
export function UnauthorizedHttpError(
  response,
  message = UnauthorizedHttpError.prototype.message,
  name = 'UnauthorizedHttpError'
) {
  HttpError.apply(this, [this.code, response, message, name]);
}
UnauthorizedHttpError.prototype = Object.create(HttpError.prototype);
UnauthorizedHttpError.prototype.code = 401;
UnauthorizedHttpError.prototype.message =
  'Authentication problem, try to re login';

/**
 * Ошибка 403 - Forbidden
 * @param response
 * @param message
 * @param name
 * @constructor
 */
export function ForbiddenHttpError(
  response,
  message = ForbiddenHttpError.prototype.message,
  name = 'ForbiddenHttpError'
) {
  HttpError.apply(this, [this.code, response, message, name]);
}
ForbiddenHttpError.prototype = Object.create(HttpError.prototype);
ForbiddenHttpError.prototype.code = 403;
ForbiddenHttpError.prototype.message =
  'Forbidden problem, login as user with the necessary roles';

/**
 * Прикладная ошибка из ответа
 * @param message
 * @param name
 * @constructor
 */
export function AppError(message, name = 'AppError') {
  FetchError.apply(this, [message, name]);
}
AppError.prototype = Object.create(FetchError.prototype);

/**
 * Обертка для fetch, которая:
 *  - вызывает обновление токена
 *  - обрабатывает 401, выбрасывает прикладное исключение
 *  - проверяет 200, content-type=application/json, при неуспехе выбрасывает прикладное исключение
 *  - логирует ошибку HttpError (тело ответа, ошибку перевыбрасывает)
 * @returns Promise<Data>
 * @throws FetchError или подтип: какая-то ошибка доступа к данным
 */
export function fetchData(url, init) {
  return fetch(url, init)
    .then((response) => {
      if (!response || !response.status) {
        throw new FetchError();
      }
      if (response.status === UnauthorizedHttpError.prototype.code) {
        throw new UnauthorizedHttpError(response);
      }
      if (response.status === ForbiddenHttpError.prototype.code) {
        throw new ForbiddenHttpError(response);
      }
      return response;
    })
    .then((response) => {
      const contentType =
        response.headers && response.headers.get('content-type');
      if (
        contentType &&
        contentType.includes('application/json') &&
        (response.status === 200 || response.status === 400)
      ) {
        return response.json();
      }
      if (response.status === 202 || response.status === 204) {
        return { data: 'no content' };
      }
      throw new HttpError(response.status, response);
    })
    .then((data) => {
      if (data && data.errorCode) {
        throw new AppError(data.message);
      }
      console.log('data=', data);
      if (
        data &&
        data.state &&
        data.state.status &&
        data.state.status === 'FAIL'
      ) {
        throw new AppError(data.state.message);
      }
      return data;
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        error.response
          .text()
          .then((errorText) => console.error('Http error:', errorText));
      }
      throw error;
    });
}

export function onFetchError(error) {
  if (error instanceof UnauthorizedHttpError) {
    console.log(
      '---',
      'Истек срок сессии или проблемы с аутентификацией. Требуется повторный вход.'
    );
    logout();
  } else if (error instanceof ForbiddenHttpError) {
    console.log('---', 'Недостаточно прав для выполнения операции.');
  } else if (error instanceof AppError) {
    console.log('---', error.message);
  } else {
    console.error('---', error); //eslint-disable-line
  }
}

/**
 * Обработчик ошибок по умолчанию: alert и перевыброс исключения
 * @param error Исключение
 * @param callback Что сделать по OK
 */
const DEFAULT_ON_ERROR = (error, callback) => {
  onFetchError(error);
  if (callback) {
    callback();
  }
};
