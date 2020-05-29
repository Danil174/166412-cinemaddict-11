import Film from "../models/film-model.js";
import Comment from "../models/comment-model.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  const films = items.map((item) => item.toRAW());
  const comments = items.map((item) => item.comments).reduce((a, b) => [...a, ...b]);

  comments.forEach((it) => {
    it.toRAW();
  });

  return {
    storeFilms: films.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {}),
    comments: comments.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {}),
  };
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
          const {storeFilms, comments} = createStoreStructure(films);

          this._store.setItems(storeFilms, `films`);
          this._store.setItems(comments, `comments`);

          return films;
        });
    }

    const filmsFromStore = Object.values(this._store.getItems(`films`));
    filmsFromStore.map((film) => {
      const newComments = [];
      film.comments.forEach((it) => {
        newComments.push(this._store.getItems(`comments`)[it]);
      });
      film.comments = newComments;
    });

    return Promise.resolve(Film.parseFilms(filmsFromStore));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = Film.clone(Object.assign(film, {id}));

    const newComments = [];
    localFilm.comments.forEach((it) => {
      newComments.push(this._store.getItems(`comments`)[it]);
    });
    localFilm.comments = newComments;

    this._store.setItem(`films`, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);

          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items, `films`);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  addComment(filmId, comment) {
    if (isOnline()) {
      return this._api.addComment(filmId, comment);
    }

    return Promise.reject(new Error(`offline`));
  }

  removeComment(commentID) {
    if (isOnline()) {
      return this._api.removeComment(commentID);
    }

    return Promise.reject(new Error(`offline`));
  }
}
