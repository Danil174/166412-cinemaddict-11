import Film from "../models/film-model.js";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilmsWithComments() {
    if (isOnline()) {
      return this._api.getFilmsWithComments()
        .then((films) => {
          films.forEach((film) => this._store.setItem(film.id, film.toRAW()));

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems);

    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  updateFilm(id, data) {
    if (isOnline()) {
      return this._api.updateFilm(id, data);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  addComment(filmId, comment) {
    if (isOnline()) {
      return this._api.addComment(filmId, comment);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  removeComment(commentID) {
    if (isOnline()) {
      return this._api.removeComment(commentID);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }
}
