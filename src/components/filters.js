import AbstractComponent from "./abstract-component.js";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const activeClass = `sort__button--active`;

const createFiltersTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Filters extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createFiltersTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  resetSortType() {
    const defaultElement = this.getElement().querySelector(`[data-sort-type="${SortType.DEFAULT}"]`);
    this.setActiveElement(defaultElement);
  }

  setActiveElement(selectedElement) {
    const elements = this.getElement().querySelectorAll(`a`);

    for (const element of elements) {
      element.classList.remove(activeClass);
    }

    selectedElement.classList.add(activeClass);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this.setActiveElement(evt.target);

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
