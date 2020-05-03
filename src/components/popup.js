import AbstractSmartComponent from "./abstract-smart-component.js";
import {getReleaseDate, getFilmDuration, getHumanizeDate} from "../utils/common.js";

const generateGenresTemplate = (genres) => {
  return genres
    .map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    })
    .join(`\n`);
};

const generateCommentsTemplate = (comments) => {
  return comments
    .map(({comment, author, date, emotion} = comments) => {
      const commentDate = getHumanizeDate(date);

      return (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    })
    .join(`\n`);
};

const setInputCheck = (checked) => {
  return (checked ? `checked` : ``);
};

const createFilmPopupTemplate = (film) => {
  const {
    img,
    name,
    originalName,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    country,
    genres,
    description,
    allowedAge,
    watchlist,
    history,
    favorites,
    comments
  } = film;

  const readableDate = getReleaseDate(releaseDate);
  const multiGenresSign = genres.length > 1 ? `s` : ``;
  const watchlistCheckStatus = setInputCheck(watchlist);
  const watchedCheckStatus = setInputCheck(history);
  const favoritetCheckStatus = setInputCheck(favorites);
  const commentsAmount = comments.length;
  const generesDetails = generateGenresTemplate(genres);
  const commentsTemplate = generateCommentsTemplate(comments);
  const prettyDuration = getFilmDuration(duration);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${img}" alt="">

              <p class="film-details__age">${allowedAge}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${originalName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${readableDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${prettyDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${multiGenresSign}</td>
                  <td class="film-details__cell">
                    ${generesDetails}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistCheckStatus}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedCheckStatus}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoritetCheckStatus}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

const smileClickHandler = (evt) => {
  const target = evt.target;

  if (target.tagName !== `IMG`) {
    return;
  }

  const newCommentContainer = target.parentElement.parentElement.parentElement;
  const emotionContainer = newCommentContainer.querySelector(`.film-details__add-emoji-label`);
  const targetSmile = target.cloneNode();
  const emotion = target.parentElement.htmlFor;

  targetSmile.width = `55`;
  targetSmile.height = `55`;
  targetSmile.alt = emotion;

  emotionContainer.innerHTML = ``;
  emotionContainer.appendChild(targetSmile);
};

export default class PopUp extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._closeButtonClickHandler = null;
    this._watchlistCheckboxHandler = null;
    this._watchedCheckboxHandler = null;
    this._favoriteCheckboxHandler = null;
    this._smileClickHandler = null;
    this._setDeleteCommentBtnClickHandler = null;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setWatchlistCheckboxHandler(this._watchlistCheckboxHandler);
    this.setWatchedCheckboxHandler(this._watchedCheckboxHandler);
    this.setFavoriteCheckboxHandler(this._favoriteCheckboxHandler);
    this.setSmileClickHandler(this._smileClickHandler);
    this.setDeleteCommentBtnClickHandler(this._setDeleteCommentBtnClickHandler);
  }

  rerender() {
    super.rerender();
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._closeButtonClickHandler = handler;
  }

  setWatchlistCheckboxHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);

    this._watchlistCheckboxHandler = handler;
  }

  setWatchedCheckboxHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);

    this._watchedCheckboxHandler = handler;
  }

  setFavoriteCheckboxHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);

    this._favoriteCheckboxHandler = handler;
  }

  setSmileClickHandler() {
    this.getElement().querySelectorAll(`.film-details__emoji-label`)
      .forEach((el) => {
        el.addEventListener(`click`, smileClickHandler);
      });

    this._smileClickHandler = smileClickHandler;
  }

  setDeleteCommentBtnClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((el, index) => {
        el.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          handler(index);
        });
      });

    this._setDeleteCommentBtnClickHandler = handler;
  }
}

