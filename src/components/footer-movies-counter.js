import {createElement} from "../util.js";

const createMoviesCounterTemplate = (amount) => {
  return (
    `<section class="footer__statistics">
      ${amount} inside
    </section>`
  );
};

export default class MoviesCounter {
  constructor(amount) {
    this._amount = amount;

    this._element = null;
  }

  getTemplate() {
    return createMoviesCounterTemplate(this._amount);
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
