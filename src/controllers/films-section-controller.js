import FilmsListComponent from "../components/films-list.js";
import FilmComponent from "../components/film-card.js";
import ContainerComponent from "../components/container.js";
import ShowMoreBtnComponent from "../components/show-more-btn.js";
import PopupComponent from "../components/popup.js";
import {getAmountByCurrentKey, sortObjectsByKeyMaxMin} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {mainPageConfigs, sectionTitles, KeyCodes} from "../const.js";

// const topRated = sortObjectsByKeyMaxMin(filmsCollection, `rating`);
// const mostCommented = sortObjectsByKeyMaxMin(filmsCollection, `numberOfComments`);


// const renderFilm = (container, film, position) => {
//   const renderPopUp = () => {
//     render(document.body, popup, RenderPosition.BEFOREEND);
//     document.addEventListener(`keydown`, onEscKeyDown);
//     popup.setCloseButtonClickHandler(onPopUpCloseBtnClick);
//   };

//   const removePopUp = () => {
//     remove(popup);
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   };

//   const onPopUpCloseBtnClick = () => {
//     removePopUp();
//   };

//   const onEscKeyDown = (evt) => {
//     if (evt.keyCode === KeyCodes.ESC_KEYCODE) {
//       removePopUp();
//     }
//   };

//   const filmComponent = new FilmComponent(film);
//   render(container, filmComponent, position);

//   const popup = new PopupComponent(film);

//   filmComponent.setOpenPopUpElementsClickHandler(renderPopUp);
// };

// const renderFilms = (parent, collection, from, to, positionIn) => {
//   collection.slice(from, to)
//     .forEach((film) => renderFilm(parent, film, positionIn));
// };

// const renderBigList = (list, films) => {
//   list.getElement().querySelector(`.films-list__title`).classList.add(`visually-hidden`);

//   const listContainer = new ContainerComponent();
//   render(list.getElement(), listContainer, RenderPosition.BEFOREEND);

//   let showingFilmsCount = mainPageConfigs.SHOWING_FILM_ON_START;

//   renderFilms(listContainer.getElement(), films, 0, showingFilmsCount, RenderPosition.BEFOREEND);

//   const showMoreBtnComponent = new ShowMoreBtnComponent();
//   render(list.getElement(), showMoreBtnComponent, RenderPosition.BEFOREEND);

//   showMoreBtnComponent.setClickHandler(() => {
//     const prevFilmCount = showingFilmsCount;
//     showingFilmsCount = showingFilmsCount + mainPageConfigs.SHOWING_FILM_BY_BUTTON;

//     renderFilms(listContainer.getElement(), films, prevFilmCount, showingFilmsCount, RenderPosition.BEFOREEND);

//     if (showingFilmsCount >= films.length) {
//       remove(showMoreBtnComponent);
//     }
//   });
// };

// const renderList = ({container, title, isExtraList, position, collection, showingElements}) => {
//   const list = new FilmsListComponent(title, isExtraList);
//   render(container, list, position);
//   const listContainer = new ContainerComponent();
//   render(list.getElement(), listContainer, RenderPosition.BEFOREEND);
//   renderFilms(listContainer.getElement(), collection, 0, showingElements, RenderPosition.BEFOREEND);
// };

// const renderMainContent = () => {
//   if (filmsCollection.length) {
//     const filmsPrimaryList = new FilmsListComponent(sectionTitles.DEFAULT);
//     render(filmsSection.getElement(), filmsPrimaryList, RenderPosition.BEFOREEND);

//     renderBigList(filmsPrimaryList, filmsCollection);

//     // дополнительная часть
//     renderList({
//       container: filmsSection.getElement(),
//       title: sectionTitles.RATED,
//       isExtraList: true,
//       position: RenderPosition.BEFOREEND,
//       collection: topRated,
//       showingElements: mainPageConfigs.PROMOTE_COUNT
//     });
//     renderList({
//       container: filmsSection.getElement(),
//       title: sectionTitles.COMMENTED,
//       isExtraList: true,
//       position: RenderPosition.BEFOREEND,
//       collection: mostCommented,
//       showingElements: mainPageConfigs.PROMOTE_COUNT
//     });
//   } else {
//     const emptyList = new FilmsListComponent(sectionTitles.EMPTY);
//     render(filmsSection.getElement(), emptyList, RenderPosition.BEFOREEND);
//   }
// };
const renderPage = (pageComponent, tasks, comments) =>  {
  console.log(pageComponent);
  console.log(tasks);
  console.log(comments);
};

export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(task, comments) {
    renderPage(this._container, task, comments);
  }
}
