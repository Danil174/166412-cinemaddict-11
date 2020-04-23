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

    this._filmComponent = new FilmComponent(film);
    this._popup = new PopupComponent(film);

    render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
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

    // if (oldFilmComponent && oldPopupComponent) {
    //   replace(this._filmComponent, oldFilmComponent);
    // } else {
    //   render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    // }
  }

  _renderPopUp() {
    render(this._popupContainer, this._popup, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._popup.setCloseButtonClickHandler(this._onPopUpCloseBtnClick);

    this._popup.setWatchlistCheckboxHandler(() => {

      this._rerenderPopup();
    });

    this._popup.setWatchedCheckboxHandler(() => {
      this._onDataChange(this, this._popup._film, Object.assign({}, this._popup._film, {
        watched: !this._filmComponent._film.watched
      }));
    });

    this._popup.setFavoriteCheckboxHandler(() => {
      this._onDataChange(this, this._popup._film, Object.assign({}, this._popup._film, {
        favorite: !this._popup._film.favorite
      }));
    });
  }

  _rerenderPopup() {
    this._popup.rerender();
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
    // this._onDataChange(this, this._popup._film, Object.assign({}, this._popup._film));
    remove(this._popup);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
