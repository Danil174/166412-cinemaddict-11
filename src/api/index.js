import Film from "../models/film.js";
import Comment from "../models/comment.js";
import {StatusCodes, Method} from "../const.js";

const checkStatus = (response) => {
  if (response.status >= StatusCodes.SUCCESS && response.status < StatusCodes.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilmsWithComments() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => {
        return films.map((film) => this._updateFilmComments(film));
      })
    .then((data) => Promise.all(data))
    .then(Film.parseFilms);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then((film) => this._updateFilmComments(film))
    .then(Film.parseFilm);
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  addComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then((data) => this._filmWithNewComments(data));
  }

  removeComment(commentID) {
    return this._load({
      url: `comments/${commentID}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _filmWithNewComments(data) {
    const newComments = [];
    const film = new Film(data.movie);

    data.comments.forEach((comment) => {
      newComments.push(new Comment(comment));
    });

    film.comments = newComments;

    return film;
  }

  _updateFilmComments(film) {
    return this.getComments(film.id)
      .then((comments) => {
        film.comments = comments;
        return film;
      });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
