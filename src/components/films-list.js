import {createElement} from "../util.js";

const extraClass = `--extra`;

export const createListSectionTemplate = (title, isExtraList) => {
  const classPostfix = isExtraList ? extraClass : ``;
  return (
    `<section class="films-list${classPostfix}">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class ListSection {
  constructor(title, isExtraLis = false) {
    this._title = title;
    this._isExtraLis = isExtraLis;

    this._element = null;
  }

  getTemplate() {
    return createListSectionTemplate(this._title, this._isExtraLis);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
