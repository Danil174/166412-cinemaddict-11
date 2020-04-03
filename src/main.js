import {createHeaderProfileTemplate} from "./components/header-profile.js";
import {createMainNavigationTemplate} from "./components/main-navigation.js";
import {createFilmFiltersTemplate} from "./components/filters.js";
import {createFilmsSectionTemplate} from "./components/films-section.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreBtnTemplate} from "./components/show-more-btn.js";
import {createExtraSectionTemplate} from "./components/extra-section.js";
import {createFilmPopupTemplate} from "./components/popup.js";

const CARD_COUNT = 5;
const PROMOTE_COUNT = 2;
const RATED_TITLE = `Top rated`;
const COMMENTED_TITLE = `Most commented`;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createHeaderProfileTemplate(), `beforeend`);
render(siteMainElement, createMainNavigationTemplate(), `beforeend`);
render(siteMainElement, createFilmFiltersTemplate(), `beforeend`);
render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);

const filmsSection = siteMainElement.querySelector(`.films`);
const filmsContainer = filmsSection.querySelector(`.films-list__container`);

for (let i = 0; i < CARD_COUNT; i++) {
  render(filmsContainer, createFilmCardTemplate(), `beforeend`);
}

render(filmsSection, createShowMoreBtnTemplate(), `beforeend`);

render(filmsSection, createExtraSectionTemplate(RATED_TITLE), `beforeend`);
render(filmsSection, createExtraSectionTemplate(COMMENTED_TITLE), `beforeend`);

const topRatedContainer = filmsSection.querySelector(`.films-list--extra:nth-last-child(2) .films-list__container`);
const commentedContainer = filmsSection.querySelector(`.films-list--extra:last-child .films-list__container`);

for (let i = 0; i < PROMOTE_COUNT; i++) {
  render(topRatedContainer, createFilmCardTemplate(), `beforeend`);
}

for (let i = 0; i < PROMOTE_COUNT; i++) {
  render(commentedContainer, createFilmCardTemplate(), `beforeend`);
}

render(siteMainElement, createFilmPopupTemplate(), `beforeend`);
