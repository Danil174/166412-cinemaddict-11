import NavigationComponent from "../components/navigation.js";
import FiltersComponent from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import FilmComponent from "../components/film-card.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import PopupComponent from "../components/popup.js";

import {
  getElementFromBinaryArr,
  getAmountByCurrentKey,
  concatAndSortByCommentsCollections,
  concatAndSortByRatingCollections,
} from "../utils/common.js";
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

const filteredMovies = (films) => {
  return ({
    inWatchlist: getAmountByCurrentKey(films, `watchlist`, true),
    watched: getAmountByCurrentKey(films, `watched`, true),
    favorite: getAmountByCurrentKey(films, `favorite`, true),
  });
};

export default class MainController {
  constructor(container) {
    this._container = container;

    this._siteMainFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);
  }

  render(films, comments) {
    const mainContainer = this._container;
    const container = this._filmsSection.getElement();
    const primaryList = this._primaryList.getElement();

    const showingFilmsInStart = films.slice(0, mainPageConfigs.SHOWING_FILM_BY_BUTTON);

    const topRaredWithComment = concatAndSortByRatingCollections(films, comments);
    const topRaredFilms = getElementFromBinaryArr(topRaredWithComment, 0);
    const topRaredComments = getElementFromBinaryArr(topRaredWithComment, 1);

    const mostCommentedWithComment = concatAndSortByCommentsCollections(films, comments);
    const mostCommentedFilms = getElementFromBinaryArr(mostCommentedWithComment, 0);
    const mostCommentedComments = getElementFromBinaryArr(mostCommentedWithComment, 1);
    // создание и отрисовка навигации
    const navigationComponent = new NavigationComponent(filteredMovies(films));
    render(mainContainer, navigationComponent, RenderPosition.BEFOREEND);
    // отрисовка сортировки
    render(mainContainer, this._siteMainFilters, RenderPosition.BEFOREEND);
    // отрисовка секции с фильмами
    render(mainContainer, this._filmsSection, RenderPosition.BEFOREEND);
    // отрисовка пустого элемента, если нет фильмов, прерывание
    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderList(container, this._primaryList, showingFilmsInStart, comments);
    renderList(container, this._topRatedList, topRaredFilms, topRaredComments);
    renderList(container, this._mostCommentedList, mostCommentedFilms, mostCommentedComments);

    let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

    render(primaryList, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(() => {
      const prevFilmCount = showingFilmsCount;
      const listContainer = this._showMoreBtnComponent.getElement().parentElement.querySelector(`.films-list__container`);

      showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

      renderFilms(listContainer, films.slice(prevFilmCount, showingFilmsCount), comments.slice(prevFilmCount, showingFilmsCount));

      if (showingFilmsCount >= films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }
}
