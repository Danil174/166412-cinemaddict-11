import FilmController from "./film-controller.js";
import FilterController from "./navigation.js";

import FiltersComponent, {SortType} from "../components/filters.js";
import FilmsSectionComponent from "../components/films-section.js";
import FilmsListComponent from "../components/films-list.js";
import EmptyListComponent from "../components/empty-list.js";
import StatisticComponent from "../components/statistic.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import {getRandomFilmsByMaxPropertyValue, getRandomFilmsByMaxPropertyLenght} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles, emptyListTitles, DataChangeMode, ExtraListsPropertiesName, HIDDEN_CLASS} from "../const.js";

const renderFilms = (parent, collection, onDataChange, onViewChange, mainController) => {
  return collection.map((film) => {
    const filmController = new FilmController(parent, onDataChange, onViewChange, mainController);

    filmController.render(film);

    return filmController;
  });
};

const renderList = (container, currentList, films, onDataChange, onViewChange, mainController) => {
  render(container, currentList, RenderPosition.BEFOREEND);
  const innerContainer = currentList.getElement().querySelector(`.films-list__container`);
  const newFilms = renderFilms(innerContainer, films, onDataChange, onViewChange, mainController);
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
    this._showedFilmControllersTopRated = [];
    this._showedFilmControllersMostCommented = [];
    this._statistic = null;
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
    this._updateData = this._updateData.bind(this);
    this._onRemoveComment = this._onRemoveComment.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
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

    this._renderStatistics();

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._startList(films);
    this._renderTopRatedList();
    this._renderMostCommented();
    this._renderShowMoreBtn();
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

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _renderControls() {
    const filterController = new FilterController(this._container, this._filmsModel, this);
    filterController.render();

    render(this._container, this._siteFilters, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSection, RenderPosition.BEFOREEND);
  }

  _renderStatistics() {
    this._statistic = new StatisticComponent(this._filmsModel);
    render(this._container, this._statistic, RenderPosition.BEFOREEND);
    this._statistic.hide();
  }

  showStatistic() {
    this._filmsSection.hide();
    this._siteFilters.hide();
    this._statistic.show();
  }

  hideStatistic() {
    this._filmsSection.show();
    this._siteFilters.show();
    this._statistic.hide();
  }

  _startList(films) {
    const showingFilmsInStart = films.slice(0, mainPageConfigs.SHOWING_FILM_ON_START);
    const newFilms = renderList(this._filmsSection.getElement(), this._primaryList, showingFilmsInStart, this._onDataChange, this._onViewChange, this);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
  }

  _renderTopRatedList() {
    const topRatedFilms = getRandomFilmsByMaxPropertyValue(this._filmsModel.getFilmsAll(), mainPageConfigs.PROMOTE_COUNT, ExtraListsPropertiesName.RATING);
    if (topRatedFilms.length === 0) {
      return;
    }
    const extraFilms = renderList(this._filmsSection.getElement(), this._topRatedList, topRatedFilms, this._onDataChange, this._onViewChange, this);
    this._showedFilmControllersTopRated.push(...extraFilms);
  }

  _renderMostCommented() {
    const mostCommentedFilms = getRandomFilmsByMaxPropertyLenght(this._filmsModel.getFilmsAll(), mainPageConfigs.PROMOTE_COUNT, ExtraListsPropertiesName.COMMENTS);
    if (mostCommentedFilms.length === 0) {
      return;
    }
    const extraFilms = renderList(this._filmsSection.getElement(), this._mostCommentedList, mostCommentedFilms, this._onDataChange, this._onViewChange, this);
    this._showedFilmControllersMostCommented.push(...extraFilms);
  }

  updateMostCommentedFilms() {
    this._showedFilmControllersMostCommented.forEach((filmController) => filmController.destroy());
    this._showedFilmControllersMostCommented = [];
    this._renderMostCommented();
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

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange, this._onViewChange, this);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _onSortTypeChange(sortType) {
    this._removeFilms();
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    const newFilms = renderFilms(this._primaryListContainer, sortedFilms, this._onDataChange, this._onViewChange, this);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();
  }

  _onViewChange() {
    const allShowedFilmControllers = this._showedFilmControllers.concat(
        ...this._showedFilmControllersMostCommented,
        ...this._showedFilmControllersTopRated
    );
    allShowedFilmControllers.forEach((it) => it.setDefaultView());
  }

  updateAfterDataChange() {
    this._updateFilms(this._showingFilmsCount);
  }

  _updateFilms(count) {
    this._removeFilms();
    const newFilms = renderFilms(this._primaryListContainer, this._filmsModel.getFilms().slice(0, count), this._onDataChange, this._onViewChange, this);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn();

    const isEmpty = newFilms.length === 0 ? true : false;
    this._setListTitle(isEmpty);
  }

  _setListTitle(isEmpty) {
    const title = this._primaryListElement.querySelector(`.films-list__title`);

    if (isEmpty) {
      title.textContent = emptyListTitles.EMPTY;
      title.classList.remove(HIDDEN_CLASS);
    } else {
      title.classList.add(HIDDEN_CLASS);
      title.textContent = sectionTitles.DEFAULT;
    }
  }

  _onFilterChange() {
    this._showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;
    this._siteFilters.resetSortType();
    this._updateFilms(this._showingFilmsCount);
  }

  _onDataChange(mode, oldData, newData, commentInfo = null) {
    switch (mode) {
      case DataChangeMode.CHANGE:
        this._updateData(oldData, newData);
        break;
      case DataChangeMode.CHANGE_POPUP:
        this._updatePopUpData(oldData, newData);
        break;
      case DataChangeMode.ADD:
        this._onAddComment(oldData, commentInfo);
        break;
      case DataChangeMode.DELETE:
        this._onRemoveComment(oldData, newData, commentInfo);
        break;
    }
  }

  _onRemoveComment(oldData, newData, commentInfo) {
    this._api.removeComment(commentInfo)
    .then(() => this._upDateLocalData(oldData.id, newData))
    .catch(() => {
      const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
      controlletsToUpdate.forEach((it) => it.dеleteDeny());
    });
  }

  _onAddComment(oldData, commentInfo) {
    this._api.addComment(oldData.id, commentInfo)
    .then((updatedFilm) => this._upDateLocalData(oldData.id, updatedFilm))
    .catch(() => {
      const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
      controlletsToUpdate.forEach((it) => it.addDeny());
    });
  }

  _updatePopUpData(oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
        .then((filmsModel) => {
          this._upDateLocalData(oldData.id, filmsModel);
        })
        .catch(() => {
          const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
          controlletsToUpdate.forEach((it) => it.shake());
        });
  }

  _updateData(oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
        .then((filmsModel) => {
          this._upDateLocalData(oldData.id, filmsModel);
        })
        .then(() => {
          this._updateFilms(this._showingFilmsCount);
        })
        .catch(() => {
          const controlletsToUpdate = this._getFilmControllersToUpdate(oldData.id);
          controlletsToUpdate.forEach((it) => it.shake());
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
    const allShowedFilmControllers = this._showedFilmControllers.concat(
        ...this._showedFilmControllersMostCommented,
        ...this._showedFilmControllersTopRated
    );
    return allShowedFilmControllers.filter((it) => it._filmComponent._film.id === id);
  }
}
