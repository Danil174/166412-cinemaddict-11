import {createElement} from "../util.js";

export const createContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class ExtraSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContainerTemplate();
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
