import NavigationComponent from "../components/navigation.js";
import FiltersComponent, {SortType} from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import FilmComponent from "../components/film-card.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import PopupComponent from "../components/popup.js";

import {
  getAmountByCurrentKey,
  sortObjectsByKeyMaxMin,
  sortObjectsByValueLength,
} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles, KeyCodes} from "../const.js";

const renderFilm = (container, film) => {
  const filmComponent = new FilmComponent(film);
  const popup = new PopupComponent(film);

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

const renderFilms = (parent, collection) => {
  collection.forEach((film) => {
    renderFilm(parent, film);
  });
};

const renderList = (container, currentList, films) => {
  render(container, currentList, RenderPosition.BEFOREEND);
  const innerContainer = currentList.getElement().querySelector(`.films-list__container`);
  renderFilms(innerContainer, films);
};

const filteredMovies = (films) => {
  return ({
    inWatchlist: getAmountByCurrentKey(films, `watchlist`, true),
    watched: getAmountByCurrentKey(films, `watched`, true),
    favorite: getAmountByCurrentKey(films, `favorite`, true),
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class MainController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._siteFilters.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _initLists() {
    const showingFilmsInStart = this._films.slice(0, mainPageConfigs.SHOWING_FILM_BY_BUTTON);
    const topRaredFilms = sortObjectsByKeyMaxMin(this._films, `rating`).slice(0, 2);
    const mostCommentedFilms = sortObjectsByValueLength(this._films, `comments`).slice(0, 2);

    renderList(this._filmsSection.getElement(), this._primaryList, showingFilmsInStart);
    renderList(this._filmsSection.getElement(), this._topRatedList, topRaredFilms);
    renderList(this._filmsSection.getElement(), this._mostCommentedList, mostCommentedFilms);
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

    this._primaryListContainer.innerHTML = ``;

    renderFilms(this._primaryListContainer, sortedFilms);

    this._renderShowMoreBtn();
  }

  _renderShowMoreBtn() {
    const btnContainer = this._primaryListElement;
    const filmsContainer = this._primaryListContainer;

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    render(btnContainer, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(() => {
      const prevFilmCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._siteFilters.getSortType(), prevFilmCount, this._showingFilmsCount);

      renderFilms(filmsContainer, sortedFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  render(films) {
    this._films = films;
    const mainContainer = this._container;
    const container = this._filmsSection.getElement();
    this._primaryListElement = this._primaryList.getElement();
    this._primaryListContainer = this._primaryListElement.querySelector(`.films-list__container`);

    const navigationComponent = new NavigationComponent(filteredMovies(films));
    render(mainContainer, navigationComponent, RenderPosition.BEFOREEND);
    render(mainContainer, this._siteFilters, RenderPosition.BEFOREEND);
    render(mainContainer, this._filmsSection, RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._initLists(films);

    this._renderShowMoreBtn();
  }
}
