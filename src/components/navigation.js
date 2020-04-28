import AbstractComponent from "./abstract-component.js";
import {getAmountByCurrentKey} from "../utils/common.js";


export const createNavigationTemplate = (films) => {
  const inWatchlist = getAmountByCurrentKey(films, `watchlist`, true);
  const watched = getAmountByCurrentKey(films, `watched`, true);
  const favorite = getAmountByCurrentKey(films, `favorite`, true);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${inWatchlist}</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched}</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  constructor(collection) {
    super();

    this._collection = collection;
  }

  getTemplate() {
    return createNavigationTemplate(this._collection);
  }
}
