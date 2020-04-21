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

const getSortedFilms = (films, sortType) => {
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

  return sortedFilms;
};

export default class MainController {
  constructor(container) {
    this._container = container;

    this._siteFilters = new FiltersComponent();
    this._filmsSection = new FilmsSectionComponent();
    this._emptyListComponent = new EmptyListComponent();
    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._primaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    this._topRatedList = new FilmsListComponent(sectionTitles.RATED, true);
    this._mostCommentedList = new FilmsListComponent(sectionTitles.COMMENTED, true);
  }

  _initLists(films) {
    const showingFilmsInStart = films.slice(0, mainPageConfigs.SHOWING_FILM_BY_BUTTON);
    const topRaredFilms = sortObjectsByKeyMaxMin(films, `rating`).slice(0, 2);
    const mostCommentedFilms = sortObjectsByValueLength(films, `comments`).slice(0, 2);

    renderList(this._filmsSection.getElement(), this._primaryList, showingFilmsInStart);
    renderList(this._filmsSection.getElement(), this._topRatedList, topRaredFilms);
    renderList(this._filmsSection.getElement(), this._mostCommentedList, mostCommentedFilms);
  }

  render(films) {
    const renderShowMore = () => {
      if (showingFilmsCount >= films.length) {
        remove(this._showMoreBtnComponent);
      }

      render(primaryList, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

      this._showMoreBtnComponent.setClickHandler(() => {
        const prevFilmCount = showingFilmsCount;

        showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

        renderFilms(primaryListContainer, films.slice(prevFilmCount, showingFilmsCount));

        if (showingFilmsCount >= films.length) {
          remove(this._showMoreBtnComponent);
        }
      });
    };

    const mainContainer = this._container;
    const container = this._filmsSection.getElement();
    const primaryList = this._primaryList.getElement();
    const primaryListContainer = primaryList.querySelector(`.films-list__container`);

    let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

    const navigationComponent = new NavigationComponent(filteredMovies(films));
    render(mainContainer, navigationComponent, RenderPosition.BEFOREEND);
    render(mainContainer, this._siteFilters, RenderPosition.BEFOREEND);
    render(mainContainer, this._filmsSection, RenderPosition.BEFOREEND);

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._initLists(films);

    renderShowMore();

    this._siteFilters.setSortTypeChangeHandler((sortType) => {
      showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

      const sortedFilms = getSortedFilms(films, sortType);

      primaryListContainer.innerHTML = ``;

      renderFilms(primaryListContainer, sortedFilms.slice(0, showingFilmsCount));

      renderShowMore();
    });
  }
}
