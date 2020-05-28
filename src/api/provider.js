import Film from "../models/film-model.js";
import Comment from "../models/comment-model.js";

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
          films.forEach((film) => {
            // film.comments.forEach((comment) => this._store.setItem(`comment_${comment.id}`, comment.toRAW()));
            // this._store.setItem(`film_${film.id}`, film.toRAW());
            this._store.setItem(film.id, film.toRAW());
          });
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    // const films = this.getDataByStr(storeData, `film_`);
    // const comments = this.getDataByStr(storeData, `comment_`);
    // console.log(films);
    // console.log(comments);
    // films.forEach((film) => {
    //   films.comments.forEach((comment) => {
    //     comment = comments.id
    //   });
    // });


    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  // getDataByStr(data, str) {
  //   const arr = [];
  //   for (let prop of data) {
  //     console.log(prop);
  //     if (prop.indexOf(str) !== -1) {
  //       arr.push(prop);
  //     }
  //   }
  //   return arr;
  // }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = Film.clone(Object.assign(film, {id}));

    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
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
