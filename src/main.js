import HeaderProfileComponent from "./components/header-profile.js";
import NavigationComponent from "./components/navigation.js";
import FiltersComponent from "./components/filters.js";
import FilmsSectionComponent from "./components/movies-section.js";
import FilmsListComponent from "./components/films-list.js";
import FilmComponent from "./components/film-card.js";
import ContainerComponent from "./components/container.js";
import ShowMoreBtnComponent from "./components/show-more-btn.js";
import PopupComponent from "./components/popup.js";
import FooterCounterComponent from "./components/footer-movies-counter.js";
import {generateFilms} from "./mock/film.js";
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin, render, RenderPosition} from "./util.js";
import {mainPageConfigs, sectionTitles, KeyCodes} from "./const.js";

const filmsCollection = generateFilms(mainPageConfigs.CARD_COUNT);

const filteredMovies = {
  inWatchlist: getAmountByCurrentKey(filmsCollection, `watchlist`, true),
  watched: getAmountByCurrentKey(filmsCollection, `watched`, true),
  favorite: getAmountByCurrentKey(filmsCollection, `favorite`, true),
};

const renderFilm = (container, film, position) => {
  const showPopUpElements = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];

  const renderPopUp = () => {
    document.body.appendChild(popup.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
    popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onPopUpCloseBtnClick);
  };

  const removePopUp = () => {
    popup.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, onPopUpCloseBtnClick);
    document.body.removeChild(popup.getElement());
    popup.removeElement();
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

  const filmComponent = new FilmComponent(film);
  render(container, filmComponent.getElement(), position);

  const popup = new PopupComponent(film);

  showPopUpElements.forEach((element) => {
    filmComponent.getElement()
      .querySelector(element)
      .addEventListener(`click`, renderPopUp);
  });
};

const renderFilms = (parent, collection, from, to, positionIn) => {
  collection.slice(from, to)
    .forEach((film) => renderFilm(parent, film, positionIn));
};

const renderBigList = (list, films) => {
  list.getElement().querySelector(`.films-list__title`).classList.add(`visually-hidden`);

  const listContainer = new ContainerComponent();
  render(list.getElement(), listContainer.getElement(), RenderPosition.BEFOREEND);

  let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

  renderFilms(listContainer.getElement(), films, 0, showingFilmsCount, RenderPosition.BEFOREEND);

  const showMoreBtnComponent = new ShowMoreBtnComponent();
  render(list.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    renderFilms(listContainer.getElement(), films, prevFilmCount, showingFilmsCount, RenderPosition.BEFOREEND);

    if (showingFilmsCount >= films.length) {
      showMoreBtnComponent.getElement().remove();
      showMoreBtnComponent.removeElement();
    }
  });
};

const renderList = ({container, title, isExtraList, position, collection, showingElements}) => {
  const list = new FilmsListComponent(title, isExtraList);
  render(container, list.getElement(), position);
  const listContainer = new ContainerComponent();
  render(list.getElement(), listContainer.getElement(), RenderPosition.BEFOREEND);
  renderFilms(listContainer.getElement(), collection, 0, showingElements, RenderPosition.BEFOREEND);
};

const topRated = sortObjectsByKeyMaxMin(filmsCollection, `rating`);
const mostCommented = sortObjectsByKeyMaxMin(filmsCollection, `numberOfComments`);

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

const renderMainContent = () => {
  if (filmsCollection.length) {
    const filmsPrimaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    render(filmsSection.getElement(), filmsPrimaryList.getElement(), RenderPosition.BEFOREEND);

    renderBigList(filmsPrimaryList, filmsCollection);

    // дополнительная часть
    renderList({
      container: filmsSection.getElement(),
      title: sectionTitles.RATED,
      isExtraList: `--extra`,
      position: RenderPosition.BEFOREEND,
      collection: topRated,
      showingElements: mainPageConfigs.PROMOTE_COUNT
    });
    renderList({
      container: filmsSection.getElement(),
      title: sectionTitles.COMMENTED,
      isExtraList: `--extra`,
      position: RenderPosition.BEFOREEND,
      collection: mostCommented,
      showingElements: mainPageConfigs.PROMOTE_COUNT
    });
  } else {
    render(filmsSection.getElement(), (new FilmsListComponent(sectionTitles.EMPTY)).getElement(), RenderPosition.BEFOREEND);
  }
};

renderMainContent();

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter.getElement(), RenderPosition.BEFOREEND);
