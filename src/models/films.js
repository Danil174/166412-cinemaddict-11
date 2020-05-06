import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

class Comments {
  constructor() {
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = Array.from(comments);
  }

  getComment(id) {
    return this._comments.find((comment) => comment.id === id);
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
    this._callHandlers(this._dataChangeHandlers);

    this._films.forEach((film) => {
      film.comments = this._setFilmComment(film.comments);
    });
  }

  _setFilmComment(comments) {
    const fillComments = [];
    comments.forEach((comment) => {
      fillComments.push(
          this.comments.getComment(comment));
    });
    return fillComments;
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
