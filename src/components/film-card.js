import AbstractComponent from "./abstract-component.js";
import {getFilmDuration} from "../utils/common.js";

const clickableCardElements = [
  `.film-card__poster`,
  `.film-card__title`,
  `.film-card__comments`
];

const createFilmCardTemplate = (film) => {
  const {
    img,
    name,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    comments,
    inWatchlist,
    watched,
    favorite
  } = film;

  const commentsLength = comments.length;
  const genre = genres[0];
  const releaseYear = releaseDate.getFullYear();

  const btnActiveClass = `film-card__controls-item--active`;
  const watchlisBtnIsActive = inWatchlist ? btnActiveClass : ``;
  const watchedBtnIsActive = watched ? btnActiveClass : ``;
  const favoriteBtnIsActive = favorite ? btnActiveClass : ``;
  const prettyDuration = getFilmDuration(duration);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${prettyDuration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsLength} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item ${watchlisBtnIsActive} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item ${watchedBtnIsActive} button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item ${favoriteBtnIsActive} button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOpenPopUpElementsClickHandler(handler) {
    clickableCardElements.forEach((element) => {
      this.getElement()
        .querySelector(element)
        .addEventListener(`click`, handler);
    });
  }

  setWatchlistBtnHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }

  setWatchedBtnHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }

  setFavoriteBtnHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }
}
