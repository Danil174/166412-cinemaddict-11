import Film from "./models/film-model.js";
import Comment from "./models/comment-model.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
        .then((response) => response.json())
        .then(Film.parseFilms);
  }

  getComments(filmId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${filmId}`, {headers})
        .then((response) => response.json())
        .then(Comment.parseComments);
  }
};

export default API;
