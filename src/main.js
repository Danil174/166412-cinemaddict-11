import HeaderProfileComponent from "./components/header-profile.js";
import NavigationComponent from "./components/navigation.js";
import FiltersComponent from "./components/filters.js";
import FilmsSectionController from "./controllers/films-section-controller.js";
import FilmsSectionComponent from "./components/films-section.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import {generateFilms} from "./mock/film.js";
import {generateComments} from "./mock/comments.js";
import {getAmountByCurrentKey} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render";
import {mainPageConfigs} from "./const.js";

const filmsCollection = generateFilms(mainPageConfigs.CARD_COUNT);
const commentsCollection = generateComments(mainPageConfigs.CARD_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const filteredMovies = {
  inWatchlist: getAmountByCurrentKey(filmsCollection, `watchlist`, true),
  watched: getAmountByCurrentKey(filmsCollection, `watched`, true),
  favorite: getAmountByCurrentKey(filmsCollection, `favorite`, true),
};

const headerProfile = new HeaderProfileComponent();
render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);

const siteMainNavigation = new NavigationComponent(filteredMovies);
render(siteMainElement, siteMainNavigation, RenderPosition.BEFOREEND);

const siteMainFilters = new FiltersComponent();
render(siteMainElement, siteMainFilters, RenderPosition.BEFOREEND);

const filmsSection = new FilmsSectionComponent();
const filmsSectionController = new FilmsSectionController(filmsSection);
render(siteMainElement, filmsSection, RenderPosition.BEFOREEND);
filmsSectionController.render(filmsCollection, commentsCollection);

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);
