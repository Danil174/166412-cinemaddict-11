import AbstractComponent from "./abstract-component.js";

const filterActiveClass = `main-navigation__item--active`;
const filterWithoutСounterName = `All movies`;

const createFilterMarkup = (filter) => {
  const {name, count, isActive} = filter;
  const counter = (filterWithoutСounterName === name) ? ` ` : ` <span class="main-navigation__item-count">${count}</span>`;
  const activeClass = isActive ? filterActiveClass : ``;

  return (` <a href="#${name}" class="main-navigation__item ${activeClass}" data-navigation-type="${name}">${name} ${counter}</a>`);
};

export const createNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
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

  setFilterClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const navigationType = evt.target.dataset.navigationType;
      handler(navigationType);
    });
  }
}
