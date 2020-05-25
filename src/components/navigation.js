import AbstractComponent from "./abstract-component.js";

const navigationActiveClass = `main-navigation__item--active`;
const filterWithoutСounterName = `All movies`;

const createFilterMarkup = (filter) => {
  const {name, count, isActive} = filter;
  const counter = (filterWithoutСounterName === name) ? ` ` : ` <span class="main-navigation__item-count">${count}</span>`;
  const activeClass = isActive ? navigationActiveClass : ``;

  return (` <a href="#${name}" class="main-navigation__item ${activeClass}" data-navigation-type="${name}">${name} ${counter}</a>`);
};

export const createNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional" data-navigation-type="statistic">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

  setActiveElement(selectedElement) {
    const elements = this.getElement().querySelectorAll(`a`);

    for (const element of elements) {
      element.classList.remove(navigationActiveClass);
    }

    selectedElement.classList.add(navigationActiveClass);
  }

  setScreenSwichClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const navigationType = evt.target.dataset.navigationType;
      handler(navigationType);
    });
  }


  setFilterClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      this.setActiveElement(evt.target);
      const navigationType = evt.target.dataset.navigationType;
      handler(navigationType);
    });
  }
}
