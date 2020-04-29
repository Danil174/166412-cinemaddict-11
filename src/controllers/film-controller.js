import FilmComponent from "../components/film-card.js";
import PopupComponent from "../components/popup.js";

import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {KeyCodes} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  CLOSE: `close`,
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmComponent = null;
    this._popupComponent = null;
    this._popupContainer = document.querySelector(`body`);
    this._renderPopUp = this._renderPopUp.bind(this);
    this._onPopUpCloseBtnClick = this._onPopUpCloseBtnClick.bind(this);
    this._removePopUp = this._removePopUp.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._popupComponent;


    this._filmComponent = new FilmComponent(film);
    this._popupComponent = new PopupComponent(film);
    render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    this._setFilmCardHandlers();
    this._setPopupHandlers();

    if (oldFilmComponent && oldPopupComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopUp();
    }
  }

  updateView(film) {
    this.render(film);
  }

  _renderPopUp() {
    this._onViewChange();
    this._popupComponent.rerender();
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.CLOSE;
  }

  _setFilmCardHandlers() {
    this._filmComponent.setOpenPopUpElementsClickHandler(this._renderPopUp);

    this._filmComponent.setWatchlistBtnHandler(() => {
      this._onDataChange(this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        watchlist: !this._filmComponent._film.watchlist
      }));
    });

    this._filmComponent.setWatchedBtnHandler(() => {
      this._onDataChange(this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        history: !this._filmComponent._film.history
      }));
    });

    this._filmComponent.setFavoriteBtnHandler(() => {
      this._onDataChange(this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        favorites: !this._filmComponent._film.favorites
      }));
    });
  }

  _setPopupHandlers() {
    this._popupComponent.setCloseButtonClickHandler(this._onPopUpCloseBtnClick);

    this._popupComponent.setWatchlistCheckboxHandler(() => {
      this._onDataChange(this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        watchlist: !this._filmComponent._film.watchlist
      }));
    });

    this._popupComponent.setWatchedCheckboxHandler(() => {
      this._onDataChange(this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        history: !this._filmComponent._film.history
      }));
    });

    this._popupComponent.setFavoriteCheckboxHandler(() => {
      this._onDataChange(this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        favorites: !this._popupComponent._film.favorites
      }));
    });

    this._popupComponent.setSmileClickHandler((evt) => {
      if (evt.target.tagName !== `IMG`) {
        return;
      }
      const popUp = this._popupComponent.getElement();
      const emotionContainer = popUp.querySelector(`.film-details__add-emoji-label`);
      const targetSmile = evt.target.cloneNode();
      const emotion = evt.target.parentElement.htmlFor;

      targetSmile.width = `55`;
      targetSmile.height = `55`;
      targetSmile.alt = emotion;

      emotionContainer.innerHTML = ``;
      emotionContainer.appendChild(targetSmile);
    });
  }

  _onPopUpCloseBtnClick() {
    this._removePopUp();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC_KEYCODE) {
      this._removePopUp();
    }
  }

  _removePopUp() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
