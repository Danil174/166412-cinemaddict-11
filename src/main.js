import API from "./api.js";
import HeaderProfileComponent from "./components/header-profile.js";
import MainController from "./controllers/main-controller.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import FilmsModel from "./models/films.js";
import {render, RenderPosition} from "./utils/render";
import {mainPageConfigs} from "./const.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const AUTHORIZATION = `Basic dXNlckBdqwerty2020ZxCvB12`;

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();

const headerProfile = new HeaderProfileComponent();
const filmsSectionController = new MainController(siteMainElement, filmsModel);
const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);

render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);


api.getFilms()
  .then((films) => {
    const commentsMap = new Map();
    filmsModel.setFilms(films);
    filmsModel.getAllIds().forEach((id) => {
      commentsMap.set(id, api.getComments(id));
    });

    return commentsMap;
  })
  .then((comments) => Promise.all(comments.values()))
  .then((comments) => {
    filmsModel.comments.setComments(comments);
    filmsSectionController.render();
  });


