import FilmComponent from "../components/film-card.js";
import PopupComponent from "../components/popup.js";
import FilmModel from "../models/film-model.js";
import CommentModel from "../models/comment-model.js";

import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {KeyCodes} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  CLOSE: `close`,
};

const SHAKE_ANIMATION_TIMEOUT = 600;

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
    this._onKeysDownAddComment = this._onKeysDownAddComment.bind(this);
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
    document.removeEventListener(`keydown`, this._onKeysDownAddComment);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopUp();
    }
  }

  updateView(film) {
    this.render(film);
  }

  shake() {
    this._popupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._popupComponent.getElement().style.animation = ``;

    }, SHAKE_ANIMATION_TIMEOUT);
  }

  dеleteDeny() {
    this.shake();
    this._popupComponent.refreshDeleteBtns();
    this._popupComponent.enableCommentInput();
  }

  addDeny() {
    this.shake();
    document.addEventListener(`keydown`, this._onKeysDownAddComment);
    this._popupComponent.enableCommentInput();
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
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.inWatchlist = !newFilm.inWatchlist;

      this._onDataChange(this._filmComponent._film, newFilm);
    });

    this._filmComponent.setWatchedBtnHandler(() => {
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.watched = !newFilm.watched;

      this._onDataChange(this._filmComponent._film, newFilm);
    });

    this._filmComponent.setFavoriteBtnHandler(() => {
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.favorite = !newFilm.favorite;

      this._onDataChange(this._filmComponent._film, newFilm);
    });
  }

  _setPopupHandlers() {
    document.addEventListener(`keydown`, this._onKeysDownAddComment);
    this._popupComponent.setCloseButtonClickHandler(this._onPopUpCloseBtnClick);

    this._popupComponent.setWatchlistCheckboxHandler(() => {
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.inWatchlist = !newFilm.inWatchlist;

      this._onDataChange(this._filmComponent._film, newFilm);
    });

    this._popupComponent.setWatchedCheckboxHandler(() => {
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.watched = !newFilm.watched;
      newFilm.watchingDate = new Date(Date.now());

      this._onDataChange(this._filmComponent._film, newFilm);
    });

    this._popupComponent.setFavoriteCheckboxHandler(() => {
      const newFilm = FilmModel.clone(this._filmComponent._film);
      newFilm.favorite = !newFilm.favorite;

      this._onDataChange(this._filmComponent._film, newFilm);
    });

    this._popupComponent.setSmileClickHandler();

    this._popupComponent.setDeleteCommentBtnClickHandler((index) => {
      const newComments = this._popupComponent._film.comments.slice();

      const commentInfo = {
        mode: `DELETE`,
        commentIdOrData: newComments.splice(index, 1).shift().id,
      };

      this._onDataChange(this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        comments: newComments
      }), commentInfo);
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

  _onKeysDownAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCodes.ENTER_KEYCODE) {
      if (this._popupComponent.checkCommentFill()) {
        this.shake();
        return;
      }

      const commentInfo = {
        mode: `ADD`,
        commentIdOrData: CommentModel.create(this._popupComponent.getComment()),
      };

      this._onDataChange(this._popupComponent._film, Object.assign({}, this._popupComponent._film, {
        comments: this._popupComponent._film.comments.concat(commentInfo.commentIdOrData)
      }), commentInfo);

      this._freezeNewComment();
    }
  }

  _freezeNewComment() {
    this._popupComponent.disableCommentInput();
    document.removeEventListener(`keydown`, this._onKeysDownAddComment);
  }

  _removePopUp() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onKeysDownAddComment);
  }
}
