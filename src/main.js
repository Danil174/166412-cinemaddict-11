import HeaderProfileComponent from "./components/header-profile.js";
import NavigationComponent from "./components/navigation.js";
import FiltersComponent from "./components/filters.js";
import FilmsSectionComponent from "./components/movies-section.js";
import FilmsListComponent from "./components/films-list.js";
import FilmComponent from "./components/film-card.js";
import ShowMoreBtnComponent from "./components/show-more-btn.js";
import ExtraSectionComponent from "./components/extra-section.js";
import PopupComponent from "./components/popup.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import {generateFilms} from "./mock/film.js";
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin, render, RenderPosition, removeElement} from "./util.js";
import {mainPageConfigs, extraSectionConfigs, KeyCodes} from "./const.js";

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

const filmsPrimaryList = new FilmsListComponent();
render(filmsSection.getElement(), filmsPrimaryList.getElement(), RenderPosition.BEFOREEND);

const renderFilm = (container, film, position) => {
  const showPopUpElements = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];

  const renderPopUp = () => {
    document.body.appendChild(popup.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
    popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onPopUpCloseBtnClick);
  };

  const onPopUpCloseBtnClick = () => {
    popup.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, onPopUpCloseBtnClick);
    document.body.removeChild(popup.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === KeyCodes.ESC_KEYCODE) {
      popup.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, onPopUpCloseBtnClick);
      document.body.removeChild(popup.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmComponent = new FilmComponent(film);
  render(container, filmComponent.getElement(), position);

  const popup = new PopupComponent(film);

  showPopUpElements.forEach((element) => {
    filmComponent.getElement()
      .querySelector(element)
      .addEventListener(`click`, renderPopUp);
  });
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

renderBigList(filmsPrimaryList, filmsCollection);

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter.getElement(), RenderPosition.BEFOREEND);

// дополнительная часть
const topRatedCollection = sortObjectsByKeyMaxMin(filmsCollection, `rating`);
const mostCommentedCollection = sortObjectsByKeyMaxMin(filmsCollection, `numberOfComments`);

const topRatedList = new ExtraSectionComponent(extraSectionConfigs.RATED_TITLE);
const mostCommentedList = new ExtraSectionComponent(extraSectionConfigs.COMMENTED_TITLE);
render(filmsSection.getElement(), topRatedList.getElement(), RenderPosition.BEFOREEND);
render(filmsSection.getElement(), mostCommentedList.getElement(), RenderPosition.BEFOREEND);

const topRatedContainer = topRatedList.getElement().querySelector(`.films-list__container`);
const commentedContainer = mostCommentedList.getElement().querySelector(`.films-list__container`);

topRatedCollection.slice(0, extraSectionConfigs.PROMOTE_COUNT)
  .forEach((film) => renderFilm(topRatedContainer, film, RenderPosition.BEFOREEND));

mostCommentedCollection.slice(0, extraSectionConfigs.PROMOTE_COUNT)
  .forEach((film) => renderFilm(commentedContainer, film, RenderPosition.BEFOREEND));
