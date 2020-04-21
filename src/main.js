import HeaderProfileComponent from "./components/header-profile.js";
import MainController from "./controllers/main-controller.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import {generateFilms} from "./mock/film.js";
import {generateComments} from "./mock/comments.js";
import {render, RenderPosition} from "./utils/render";
import {mainPageConfigs} from "./const.js";

const filmsCollection = generateFilms(mainPageConfigs.CARD_COUNT);
const commentsCollection = generateComments(mainPageConfigs.CARD_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const headerProfile = new HeaderProfileComponent();
render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);

const filmsSectionController = new MainController(siteMainElement);
filmsSectionController.render(filmsCollection, commentsCollection);

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);
