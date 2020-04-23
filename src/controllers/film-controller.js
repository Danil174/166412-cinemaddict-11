import FilmComponent from "../components/film-card.js";
import PopupComponent from "../components/popup.js";

import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {KeyCodes} from "../const.js";

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

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

  _renderPopUp() {
    console.log(this._popupComponent);
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _setFilmCardHandlers() {
    this._filmComponent.setOpenPopUpElementsClickHandler(this._renderPopUp);

    this._filmComponent.setFavoriteBtnHandler(() => {
      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        favorite: !this._filmComponent._film.favorite
      }));
    });

    this._filmComponent.setWatchedBtnHandler(() => {
      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        watched: !this._filmComponent._film.watched
      }));
    });

    this._filmComponent.setWatchlistBtnHandler(() => {
      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        watchlist: !this._filmComponent._film.watchlist
      }));
    });
  }

  _setPopupHandlers() {
    this._popupComponent.setCloseButtonClickHandler(this._onPopUpCloseBtnClick);

    this._popupComponent.setWatchlistCheckboxHandler(() => {
      this._onDataChange(this, this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        watchlist: !this._filmComponent._film.watchlist
      }));
    });

    this._popupComponent.setWatchedCheckboxHandler(() => {
      this._onDataChange(this, this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        watched: !this._filmComponent._film.watched
      }));
    });

    this._popupComponent.setFavoriteCheckboxHandler(() => {
      this._onDataChange(this, this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        favorite: !this._popupComponent._film.favorite
      }));
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
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
