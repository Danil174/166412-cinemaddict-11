export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getFilmsWithComments() {
    return this._api.getFilmsWithComments();
  }

  updateFilm(id, data) {
    return this._api.updateFilm(id, data);
  }

  addComment(filmId, comment) {
    return this._api.addComment(filmId, comment);
  }

  removeComment(commentID) {
    return this._api.removeComment(commentID);
  }
}
