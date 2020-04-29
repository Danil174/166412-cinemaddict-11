import FilmController from "./film-controller.js";
import FilterController from "./navigation.js";

import FiltersComponent, {SortType} from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import {sortObjectsByKeyMaxMin, sortObjectsByValueLength} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles} from "../const.js";

const renderFilms = (parent, collection, onDataChange, onViewChange) => {
  return collection.map((film) => {
    const filmController = new FilmController(parent, onDataChange, onViewChange);

    filmController.render(film);

    return filmController;
  });
};

const renderList = (container, currentList, films, onDataChange, onViewChange) => {
  render(container, currentList, RenderPosition.BEFOREEND);
  const innerContainer = currentList.getElement().querySelector(`.films-list__container`);
  const newFilms = renderFilms(innerContainer, films, onDataChange, onViewChange);
  return newFilms;
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
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showedFilmControllers = [];
    this._showedFilmControllersExtra = [];
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
    this._siteFilters.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const films = this._filmsModel.getFilms();
    const container = this._filmsSection.getElement();
    this._primaryListElement = this._primaryList.getElement();
    this._primaryListContainer = this._primaryListElement.querySelector(`.films-list__container`);

    this._renderControls();

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._initLists(films);

    this._renderShowMoreBtn();
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _renderControls() {
    const filterController = new FilterController(this._container, this._filmsModel);
    filterController.render();

    render(this._container, this._siteFilters, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSection, RenderPosition.BEFOREEND);
  }

  _initLists(films) {
    const topRaredFilms = sortObjectsByKeyMaxMin(films, `rating`).slice(0, 2);
    const mostCommentedFilms = sortObjectsByValueLength(films, `comments`).slice(0, 2);
    const showingFilmsInStart = films.slice(0, mainPageConfigs.SHOWING_FILM_ON_START);

    const newFilms = renderList(this._filmsSection.getElement(), this._primaryList, showingFilmsInStart, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    let newFilmsExtra = renderList(this._filmsSection.getElement(), this._topRatedList, topRaredFilms, this._onDataChange, this._onViewChange);
    newFilmsExtra = newFilmsExtra.concat(renderList(this._filmsSection.getElement(), this._mostCommentedList, mostCommentedFilms, this._onDataChange, this._onViewChange));
    this._showedFilmControllersExtra = this._showedFilmControllers.concat(newFilmsExtra);
  }

  _renderShowMoreBtn() {
    const btnContainer = this._primaryListElement;
    const filmsContainer = this._primaryListContainer;

    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(btnContainer, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(() => {
      const films = this._filmsModel.getFilms();
      const prevFilmCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

      const sortedFilms = getSortedFilms(films, this._siteFilters.getSortType(), prevFilmCount, this._showingFilmsCount);

      const newFilms = renderFilms(filmsContainer, sortedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._primaryListContainer.innerHTML = ``;

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();
  }

  _onViewChange() {
    const allShowedFilmControllers = this._showedFilmControllers.concat(this._showedFilmControllersExtra);
    allShowedFilmControllers .forEach((it) => it.setDefaultView());
  }

  _updateFilms(count) {
    this._removeFilms();
    const newFilms = renderFilms(this._primaryListContainer, this._filmsModel.getFilms().slice(0, count), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();
  }

  _onFilterChange() {
    this._updateFilms(mainPageConfigs.SHOWING_FILM_ON_START);
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);
    const allShowedFilmControllers = this._showedFilmControllers.concat(this._showedFilmControllersExtra);
    const controlletsToUpdate = allShowedFilmControllers.filter(
        (it) => {
          return (it._filmComponent._film.id === oldData.id);
        });

    if (isSuccess) {
      controlletsToUpdate.forEach(
          (it) => {
            it.updateView(newData);
          });
    }
  }
}
