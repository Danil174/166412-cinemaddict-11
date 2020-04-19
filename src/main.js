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
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin} from "./util.js";
import {render, RenderPosition, remove} from "./utils/render";
import {mainPageConfigs, sectionTitles, KeyCodes} from "./const.js";

const filmsCollection = generateFilms(mainPageConfigs.CARD_COUNT);

const topRated = sortObjectsByKeyMaxMin(filmsCollection, `rating`);
const mostCommented = sortObjectsByKeyMaxMin(filmsCollection, `numberOfComments`);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const filteredMovies = {
  inWatchlist: getAmountByCurrentKey(filmsCollection, `watchlist`, true),
  watched: getAmountByCurrentKey(filmsCollection, `watched`, true),
  favorite: getAmountByCurrentKey(filmsCollection, `favorite`, true),
};

const renderFilm = (container, film, position) => {
  const showPopUpElements = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];

  const renderPopUp = () => {
    render(document.body, popup, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
    popup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onPopUpCloseBtnClick);
  };

  const removePopUp = () => {
    remove(popup);
    document.removeEventListener(`keydown`, onEscKeyDown);
    //нужно ли тут удалять eventListener? Ведь мы удаляем компонент полностью?
    popup.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, onPopUpCloseBtnClick);
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
  render(container, filmComponent, position);

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
  render(list.getElement(), listContainer, RenderPosition.BEFOREEND);

  let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

  renderFilms(listContainer.getElement(), films, 0, showingFilmsCount, RenderPosition.BEFOREEND);

  const showMoreBtnComponent = new ShowMoreBtnComponent();
  render(list.getElement(), showMoreBtnComponent, RenderPosition.BEFOREEND);

  showMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

    renderFilms(listContainer.getElement(), films, prevFilmCount, showingFilmsCount, RenderPosition.BEFOREEND);

    if (showingFilmsCount >= films.length) {
      remove(showMoreBtnComponent);
    }
  });
};

const renderList = ({container, title, isExtraList, position, collection, showingElements}) => {
  const list = new FilmsListComponent(title, isExtraList);
  render(container, list, position);
  const listContainer = new ContainerComponent();
  render(list.getElement(), listContainer, RenderPosition.BEFOREEND);
  renderFilms(listContainer.getElement(), collection, 0, showingElements, RenderPosition.BEFOREEND);
};

const renderMainContent = () => {
  if (filmsCollection.length) {
    const filmsPrimaryList = new FilmsListComponent(sectionTitles.DEFAULT);
    render(filmsSection.getElement(), filmsPrimaryList, RenderPosition.BEFOREEND);

    renderBigList(filmsPrimaryList, filmsCollection);

    // дополнительная часть
    renderList({
      container: filmsSection.getElement(),
      title: sectionTitles.RATED,
      isExtraList: true,
      position: RenderPosition.BEFOREEND,
      collection: topRated,
      showingElements: mainPageConfigs.PROMOTE_COUNT
    });
    renderList({
      container: filmsSection.getElement(),
      title: sectionTitles.COMMENTED,
      isExtraList: true,
      position: RenderPosition.BEFOREEND,
      collection: mostCommented,
      showingElements: mainPageConfigs.PROMOTE_COUNT
    });
  } else {
    const emptyList = new FilmsListComponent(sectionTitles.EMPTY);
    render(filmsSection.getElement(), emptyList, RenderPosition.BEFOREEND);
  }
};

const headerProfile = new HeaderProfileComponent();
render(siteHeaderElement, headerProfile, RenderPosition.BEFOREEND);

const siteMainNavigation = new NavigationComponent(filteredMovies);
render(siteMainElement, siteMainNavigation, RenderPosition.BEFOREEND);

const siteMainFilters = new FiltersComponent();
render(siteMainElement, siteMainFilters, RenderPosition.BEFOREEND);

const filmsSection = new FilmsSectionComponent();
render(siteMainElement, filmsSection, RenderPosition.BEFOREEND);

renderMainContent();

const footerCounter = new FooterCounterComponent(mainPageConfigs.CARD_COUNT);
render(siteFooterElement, footerCounter, RenderPosition.BEFOREEND);
