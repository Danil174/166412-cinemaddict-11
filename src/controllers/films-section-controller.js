import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import FilmComponent from "../components/film-card.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import PopupComponent from "../components/popup.js";

import {concatCollections, getElementFromBinaryArr, sortObjectsByKeyMaxMin} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles, KeyCodes} from "../const.js";

const renderFilm = (container, film, comments) => {
  const filmComponent = new FilmComponent(film, comments);
  const popup = new PopupComponent(film, comments);

  const renderPopUp = () => {
    render(document.body, popup, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
    popup.setCloseButtonClickHandler(onPopUpCloseBtnClick);
  };

  const removePopUp = () => {
    remove(popup);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onPopUpCloseBtnClick = () => {
    removePopUp();
  };

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === KeyCodes.ESC_KEYCODE) {
      removePopUp();
    }
  };

  render(container, filmComponent, RenderPosition.BEFOREEND);

  filmComponent.setOpenPopUpElementsClickHandler(renderPopUp);
};

const renderFilms = (parent, collection, comments) => {
  let index = 0;
  collection.forEach((film) => {
    renderFilm(parent, film, comments[index++]);
  });
};

const renderList = (container, currentList, films, comments) => {
  render(container, currentList, RenderPosition.BEFOREEND);
  const innerContainer = currentList.getElement().querySelector(`.films-list__container`);
  renderFilms(innerContainer, films, comments);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);
  }

  render(films, comments) {
    const container = this._container.getElement();
    const primaryList = this._primaryList.getElement();

    const topRated = sortObjectsByKeyMaxMin(films, `rating`).slice(0, 2);
    const mostCommentedWithComment = concatCollections(films, comments);
    const mostCommentedFilms = getElementFromBinaryArr(mostCommentedWithComment, 0);
    const mostCommentedComments = getElementFromBinaryArr(mostCommentedWithComment, 1);

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderList(container, this._primaryList, films, comments);
    renderList(container, this._topRatedList, topRated, comments);
    renderList(container, this._mostCommentedList, mostCommentedFilms, mostCommentedComments);

    let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    // renderFilms(listContainer.getElement(), films, 0, showingFilmsCount, RenderPosition.BEFOREEND);

    const showMoreBtnComponent = new ShowMoreBtnComponent();
    render(primaryList, showMoreBtnComponent, RenderPosition.BEFOREEND);

    showMoreBtnComponent.setClickHandler(() => {
      const prevFilmCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

      renderFilms(listContainer.getElement(), films, prevFilmCount, showingFilmsCount, RenderPosition.BEFOREEND);

      if (showingFilmsCount >= films.length) {
        remove(showMoreBtnComponent);
      }
    });
  }
}
