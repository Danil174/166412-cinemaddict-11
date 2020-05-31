import Film from "../models/film.js";

const StoreNames = {
  FILMS: `films`,
  COMMENTS: `comments`
};

const createStoreStructure = (items) => {
  const films = items.map((item) => item.toRAW());

  return films.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const createCommentsStructure = (items) => {
  const comments = items.map((item) => item.comments).reduce((a, b) => [...a, ...b]);

  comments.forEach((it) => {
    it.toRAW();
  });

  return comments.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilmsWithComments() {
    if (this._isOnline()) {
      return this._api.getFilmsWithComments()
        .then((films) => {
          const storeFilms = createStoreStructure(films);
          const comments = createCommentsStructure(films);

          this._store.setItems(storeFilms, StoreNames.FILMS);
          this._store.setItems(comments, StoreNames.COMMENTS);

          return films;
        });
    }

    const filmsFromStore = Object.values(this._store.getItems(StoreNames.FILMS));
    filmsFromStore.map((film) => {
      film.comments = this._getCommentsFromStore(film);
    });

    return Promise.resolve(Film.parseFilms(filmsFromStore));
  }

  updateFilm(id, film) {
    if (this._isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(StoreNames.FILMS, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = Film.clone(Object.assign(film, {id}));

    localFilm.comments = this._getCommentsFromStore(localFilm);

    this._store.setItem(StoreNames.FILMS, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  sync() {
    if (this._isOnline()) {
      const filmsToUpdate = Object.values(this._store.getItems(StoreNames.FILMS));

      return this._api.sync(filmsToUpdate)
        .then((response) => {
          const updatedFilms = Film.parseFilms(response.updated);

          const storeFilms = createStoreStructure(updatedFilms);

          this._store.setItems(storeFilms, StoreNames.FILMS);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  addComment(filmId, comment) {
    if (this._isOnline()) {
      return this._api.addComment(filmId, comment);
    }

    return Promise.reject(new Error(`offline`));
  }

  removeComment(commentID) {
    if (this._isOnline()) {
      return this._api.removeComment(commentID);
    }

    return Promise.reject(new Error(`offline`));
  }

  _getCommentsFromStore(film) {
    const newComments = [];

    film.comments.forEach((it) => {
      newComments.push(this._store.getItems(StoreNames.COMMENTS)[it]);
    });

    return newComments;
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
