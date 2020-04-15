import HeaderProfileComponent from "./components/header-profile.js";
import NavigationComponent from "./components/navigation.js";
import FiltersComponent from "./components/filters.js";
import FilmsSectionComponent from "./components/movies-section.js";
import FilmsListComponent from "./components/films-list.js";
import FilmComponent from "./components/film-card.js";
import ShowMoreBtnComponent from "./components/show-more-btn.js";
import ExtraSectionComponent from "./components/extra-section.js";
// import {createFilmPopupTemplate} from "./components/popup.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import {generateFilms} from "./mock/film.js";
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin, render, RenderPosition} from "./util.js";
import {mainPageConfigs, extraSectionConfigs} from "./const.js";

const filmsCollection = generateFilms(mainPageConfigs.CARD_COUNT);

const filteredMovies = {
  inWatchlist: getAmountByCurrentKey(filmsCollection, `watchlist`, true),
  watched: getAmountByCurrentKey(filmsCollection, `watched`, true),
  favorite: getAmountByCurrentKey(filmsCollection, `favorite`, true),
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const headerProfile = new HeaderProfileComponent();
render(siteHeaderElement, headerProfile.getElement(), RenderPosition.BEFOREEND);

const siteMainNavigation = new NavigationComponent(filteredMovies);
render(siteMainElement, siteMainNavigation.getElement(), RenderPosition.BEFOREEND);

const siteMainFilters = new FiltersComponent();
render(siteMainElement, siteMainFilters.getElement(), RenderPosition.BEFOREEND);

const filmsSection = new FilmsSectionComponent();
render(siteMainElement, filmsSection.getElement(), RenderPosition.BEFOREEND);

const siteMainPrimaryList = new FilmsListComponent();
render(filmsSection.getElement(), siteMainPrimaryList.getElement(), RenderPosition.BEFOREEND);

const renderFilm = (container, film, position) => {

  const filmComponent = new FilmComponent(film);

  render(container, filmComponent.getElement(), position);
};

const renderBigList = (list, films) => {
  const filmsContainer = list.getElement().querySelector(`.films-list__container`);

  let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

  films.slice(0, showingFilmsCount)
    .forEach((film) => renderFilm(filmsContainer, film, RenderPosition.BEFOREEND));

  const showMoreBtnComponent = new ShowMoreBtnComponent();
  render(list.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    films.slice(prevFilmCount, showingFilmsCount)
      .forEach((film) => renderFilm(filmsContainer, film, RenderPosition.BEFOREEND));

    if (showingFilmsCount >= films.length) {
      showMoreBtnComponent.getElement().remove();
    }
  });
};

renderBigList(siteMainPrimaryList, filmsCollection);

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter.getElement(), RenderPosition.BEFOREEND);

// render(siteMainElement, createFilmPopupTemplate(films[0]), `beforeend`);

// дополнительная часть
// const topRatedCollection = sortObjectsByKeyMaxMin(films, `rating`);
// const mostCommentedCollection = sortObjectsByKeyMaxMin(films, `numberOfComments`);

// const topRatedList = new ExtraSectionComponent(extraSectionConfigs.RATED_TITLE);
// const mostCommentedList = new ExtraSectionComponent(extraSectionConfigs.COMMENTED_TITLE);
// render(moviesSection.getElement(), topRatedList.getElement(), RenderPosition.BEFOREEND);
// render(moviesSection.getElement(), mostCommentedList.getElement(), RenderPosition.BEFOREEND);

// const topRatedContainer = filmsSection.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
// const commentedContainer = filmsSection.querySelector(`.films-list--extra:last-child .films-list__container`);

// topRatedFilms.slice(0, PROMOTE_COUNT)
//   .forEach((film) => render(topRatedContainer, createFilmCardTemplate(film), `beforeend`));

// mostCommentedFilms.slice(0, PROMOTE_COUNT)
//   .forEach((film) => render(commentedContainer, createFilmCardTemplate(film), `beforeend`));
