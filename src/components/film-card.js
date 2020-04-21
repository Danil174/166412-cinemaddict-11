import AbstractComponent from "./abstract-component.js";

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
  } = film;

  const commentsLength = comments.length;
  const genre = genres[0];
  const releaseYear = releaseDate.getFullYear();

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsLength} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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
}
