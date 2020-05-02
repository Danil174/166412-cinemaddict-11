import HeaderProfileComponent from "./components/header-profile.js";
import MainController from "./controllers/main-controller.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import FilmsModel from "./models/films.js";
import CommentsModel from "./models/comments-model.js";
import {generateFilms} from "./mock/film.js";
import {generateAllComments} from "./mock/comments.js";
import {render, RenderPosition} from "./utils/render";
import {mainPageConfigs} from "./const.js";

const films = generateFilms(mainPageConfigs.CARD_COUNT);
const commentsModel = new CommentsModel();
const filmsModel = new FilmsModel(commentsModel);
filmsModel.setFilms(films);

const comments = generateAllComments(films);
commentsModel.setComments(comments);
filmsModel.fillFilmsComments();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const headerProfile = new HeaderProfileComponent();
render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);

const filmsSectionController = new MainController(siteMainElement, filmsModel, commentsModel);
filmsSectionController.render();

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);
