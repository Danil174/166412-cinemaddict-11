import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

class Comments {
  constructor() {
    this._comments = new Map();
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComment(id, filmId) {
    return this._comments.get(filmId).find((comment) => comment.id === id);
    // return this._comments.find((comment) => comment.id === id);
  }

  getComments(filmId) {
    return this._comments.get(filmId);
  }


  addComment(comment) {
    const index = this._comments.findIndex((it) => it.id === comment.id);

    if (index !== -1) {
      return false;
    }

    this._comments.push(comment);

    return true;
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments.splice(index, 1);

    return true;
  }
}

export default class Films {
  constructor() {
    this.comments = new Comments();

    this._films = [];
    this._filmsIds = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._setFilmsIds(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  getAllIds() {
    return this._filmsIds;
  }

  _setFilmsIds(films) {
    films.forEach((it) => this._filmsIds.push(it.id));
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
