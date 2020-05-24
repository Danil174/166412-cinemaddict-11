import FilmController from "./film-controller.js";
import FilterController from "./navigation.js";

import FiltersComponent, {SortType} from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import StatisticComponent from "../components/statistic.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import {sortObjectsByKeyMaxMin, sortObjectsByValueLength} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles, emptyListTitles} from "../const.js";

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
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._showedFilmControllers = [];
    this._showedFilmControllersExtra = [];
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent(emptyListTitles.EMPTY);
    this._loadingListComponent = new EmptyListComponent(emptyListTitles.LOAD);
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
    this._siteFilters.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    remove(this._loadingListComponent);

    const films = this._filmsModel.getFilms();
    const container = this._filmsSection.getElement();
    this._primaryListElement = this._primaryList.getElement();
    this._primaryListContainer = this._primaryListElement.querySelector(`.films-list__container`);


    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._initLists(films);

    this._renderShowMoreBtn();

    this._renderStatistics(films);
  }

  renderLoading() {
    const container = this._filmsSection.getElement();
    this._renderControls();
    render(container, this._loadingListComponent, RenderPosition.BEFOREEND);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  _renderStatistics(films) {
    const statistic = new StatisticComponent(films);
    render(this._container, statistic, RenderPosition.BEFOREEND);
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

    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(btnContainer, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._onShowMoreBtnClick);
  }

  _onShowMoreBtnClick() {
    const prevFilmCount = this._showingFilmsCount;
    const films = this._filmsModel.getFilms();
    this._showingFilmsCount = this._showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._siteFilters.getSortType(), prevFilmCount, this._showingFilmsCount);

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _onSortTypeChange(sortType) {
    this._removeFilms();
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();
  }

  _onViewChange() {
    const allShowedFilmControllers = this._showedFilmControllers.concat(this._showedFilmControllersExtra);
    allShowedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _updateFilms(count) {
    this._removeFilms();
    const newFilms = renderFilms(this._primaryListContainer, this._filmsModel.getFilms().slice(0, count), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();
  }

  _onFilterChange() {
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters.resetSortType();
    this._updateFilms(this._showingFilmsCount);
  }

  _onDataChange(oldData, newData, commentInfo = null) {
    if (commentInfo) {
      if (commentInfo.mode === `ADD`) {
        this._api.addComment(oldData.id, commentInfo.commentIdOrData)
          .then((updatedFilm) => this._upDateLocalData(oldData.id, updatedFilm))
          .catch(() => {
            const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
            controlletsToUpdate.forEach((it) => it.addDeny());
          });
      } else {
        this._api.removeComment(commentInfo.commentIdOrData)
          .then(() => this._upDateLocalData(oldData.id, newData))
          .catch(() => {
            const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
            controlletsToUpdate.forEach((it) => it.dеleteDeny());
          });
      }
    } else {
      this._updateData(oldData, newData);
    }
  }

  _updateData(oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
        .then((filmsModel) => {
          this._upDateLocalData(oldData.id, filmsModel);
        });
  }

  _upDateLocalData(id, filmsModel) {
    const isSuccess = this._filmsModel.updateFilm(id, filmsModel);

    if (isSuccess) {
      const controlletsToUpdate = this._getFilmControllersToUpdate(id);
      controlletsToUpdate.forEach((it) => it.updateView(filmsModel));
    }
  }

  _getFilmControllersToUpdate(id) {
    const allShowedFilmControllers = this._showedFilmControllers.concat(this._showedFilmControllersExtra);
    return allShowedFilmControllers.filter((it) => it._filmComponent._film.id === id);
  }
}
