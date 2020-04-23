import FilmComponent from "../components/film-card.js";
import PopupComponent from "../components/popup.js";

import {render, RenderPosition, remove} from "../utils/render.js";
import {KeyCodes} from "../const.js";

export default class TaskController {
  constructor(container) {
    this._container = container;

    this._filmComponent = null;
    this._popupComponent = null;
    this._popupContainer = document.querySelector(`body`);
    this._renderPopUp = this._renderPopUp.bind(this);
    this._removePopUp = this._removePopUp.bind(this);
    this._onPopUpCloseBtnClick = this._onPopUpCloseBtnClick.bind(this);
    this._onEscKeyDow = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._filmComponent = new FilmComponent(film);
    this._popup = new PopupComponent(film);

    render(this._container, this._filmComponent, RenderPosition.BEFOREEND);

    this._filmComponent.setOpenPopUpElementsClickHandler(this._renderPopUp);
  }

  _renderPopUp() {
    render(this._popupContainer, this._popup, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._popup.setCloseButtonClickHandler(this._onPopUpCloseBtnClick);
  }

  _removePopUp() {
    remove(this._popup);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onPopUpCloseBtnClick() {
    this._removePopUp();
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC_KEYCODE) {
      this._removePopUp();
    }
  }
}
