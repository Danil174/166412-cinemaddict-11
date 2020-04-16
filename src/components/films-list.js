import {createElement} from "../util.js";

export const createListSectionTemplate = (title, type) => {
  return (
    `<section class="films-list${type}">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class ListSection {
  constructor(title, type = ``) {
    this._title = title;
    this._type = type;

    this._element = null;
  }

  getTemplate() {
    return createListSectionTemplate(this._title, this._type);
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
