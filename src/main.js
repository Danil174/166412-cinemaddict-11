import {createHeaderProfileTemplate} from "./components/header-profile.js";
import {createMainNavigationTemplate} from "./components/main-navigation.js";
import {createFilmFiltersTemplate} from "./components/filters.js";
import {createFilmsSectionTemplate} from "./components/films-section.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreBtnTemplate} from "./components/show-more-btn.js";
import {createExtraSectionTemplate} from "./components/extra-section.js";
import {createFilmPopupTemplate} from "./components/popup.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {generateFilms} from "./mock/film.js";
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin} from "./util.js";

const CARD_COUNT = 20;
const PROMOTE_COUNT = 2;
const RATED_TITLE = `Top rated`;
const COMMENTED_TITLE = `Most commented`;
const SHOWING_FILM_CARD__ON_START = 5;
const SHOWING_FILM_CARD_BY_BUTTON = 5;

const films = generateFilms(CARD_COUNT);

const filters = {
  inWatchlist: getAmountByCurrentKey(films, `watchlist`, true),
  watched: getAmountByCurrentKey(films, `watched`, true),
  favorite: getAmountByCurrentKey(films, `favorite`, true),
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createHeaderProfileTemplate(), `beforeend`);
render(siteMainElement, createMainNavigationTemplate(filters), `beforeend`);
render(siteMainElement, createFilmFiltersTemplate(), `beforeend`);
render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);

const filmsSection = siteMainElement.querySelector(`.films`);
const filmsContainer = filmsSection.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILM_CARD__ON_START;

films.slice(0, showingFilmsCount)
  .forEach((film) => render(filmsContainer, createFilmCardTemplate(film), `beforeend`));

render(filmsSection, createShowMoreBtnTemplate(), `beforeend`);
const showMoreButton = filmsSection.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILM_CARD_BY_BUTTON;

  films.slice(prevFilmCount, showingFilmsCount)
    .forEach((film) => render(filmsContainer, createFilmCardTemplate(film), `beforeend`));

  if (showingFilmsCount >= films.length) {
    showMoreButton.remove();
  }
});

const footer = document.querySelector(`.footer`);
render(footer, createFooterStatisticsTemplate(CARD_COUNT), `beforeend`);

render(siteMainElement, createFilmPopupTemplate(films[0]), `beforeend`);

// дополнительная часть
const topRatedFilms = sortObjectsByKeyMaxMin(films, `rating`);
const mostCommentedFilms = sortObjectsByKeyMaxMin(films, `numberOfComments`);

render(filmsSection, createExtraSectionTemplate(RATED_TITLE), `beforeend`);
render(filmsSection, createExtraSectionTemplate(COMMENTED_TITLE), `beforeend`);

const topRatedContainer = filmsSection.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const commentedContainer = filmsSection.querySelector(`.films-list--extra:last-child .films-list__container`);

topRatedFilms.slice(0, PROMOTE_COUNT)
  .forEach((film) => render(topRatedContainer, createFilmCardTemplate(film), `beforeend`));

mostCommentedFilms.slice(0, PROMOTE_COUNT)
  .forEach((film) => render(commentedContainer, createFilmCardTemplate(film), `beforeend`));

// временно, что бы закрывать попап

const popup = document.querySelector(`.film-details`);

document.addEventListener(`keydown`, function (evt) {
  if (evt.keyCode === 27) {
    popup.remove();
  }
});
