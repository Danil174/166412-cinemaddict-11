import FilmController from "./film-controller.js";

import NavigationComponent from "../components/navigation.js";
import FiltersComponent, {SortType} from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";

import {
  getAmountByCurrentKey,
  sortObjectsByKeyMaxMin,
  sortObjectsByValueLength,
} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles} from "../const.js";

const renderFilms = (parent, collection, onDataChange) => {
  return collection.map((film) => {
    const filmController = new FilmController(parent, onDataChange);

    filmController.render(film);

    return filmController;
  });
};

const renderList = (container, currentList, films, onDataChange) => {
  render(container, currentList, RenderPosition.BEFOREEND);
  const innerContainer = currentList.getElement().querySelector(`.films-list__container`);
  const newFilms = renderFilms(innerContainer, films, onDataChange);
  return newFilms;
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
    this._showedFilmControllers = [];
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._siteFilters.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _initLists() {
    const showingFilmsInStart = this._films.slice(0, mainPageConfigs.SHOWING_FILM_BY_BUTTON);
    const topRaredFilms = sortObjectsByKeyMaxMin(this._films, `rating`).slice(0, 2);
    const mostCommentedFilms = sortObjectsByValueLength(this._films, `comments`).slice(0, 2);

    let newFilms = renderList(this._filmsSection.getElement(), this._primaryList, showingFilmsInStart, this._onDataChange);
    newFilms = newFilms.concat(renderList(this._filmsSection.getElement(), this._topRatedList, topRaredFilms), this._onDataChange);
    newFilms = newFilms.concat(renderList(this._filmsSection.getElement(), this._mostCommentedList, mostCommentedFilms), this._onDataChange);
    return newFilms;
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

    this._primaryListContainer.innerHTML = ``;

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange);
    this._showedFilmControllers = newFilms;

    this._renderShowMoreBtn();
  }

  _renderShowMoreBtn() {
    const btnContainer = this._primaryListElement;
    const filmsContainer = this._primaryListContainer;

    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    render(btnContainer, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(() => {
      const prevFilmCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._siteFilters.getSortType(), prevFilmCount, this._showingFilmsCount);

      const newFilms = renderFilms(filmsContainer, sortedFilms, this._onDataChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    filmController.render(this._films[index]);
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

    const newFilms = this._initLists(films);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreBtn();
  }
}
