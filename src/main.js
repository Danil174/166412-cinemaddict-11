import API from "./api.js";
import HeaderProfileComponent from "./components/header-profile.js";
import MainController from "./controllers/main-controller.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import FilmsModel from "./models/films.js";
import {render, RenderPosition} from "./utils/render";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const AUTHORIZATION = `Basic dXNlckBdqsdfwerty2020ZxCvB12`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const headerProfile = new HeaderProfileComponent();
const filmsSectionController = new MainController(siteMainElement, filmsModel, api);
const footerCounter = new FooterCounterComponent(0);

render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);
filmsSectionController.renderLoading();
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);


api.getFilmsWithComments()
  .then((films) => {
    filmsModel.setFilms(films);
    filmsSectionController.render();
    footerCounter.updateCounter(filmsModel.getFilms().length);
    headerProfile.setUserRang(filmsModel.getWatchedFilms());
  })
  .catch(() => {
    filmsSectionController.render();
  });

