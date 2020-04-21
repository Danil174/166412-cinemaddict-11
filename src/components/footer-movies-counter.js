import AbstractComponent from "./abstract-component.js";

const createMoviesCounterTemplate = (amount) => {
  return (
    `<section class="footer__statistics">
      ${amount} inside
    </section>`
  );
};

export default class MoviesCounter extends AbstractComponent {
  constructor(amount) {
    super();

    this._amount = amount;
  }

  getTemplate() {
    return createMoviesCounterTemplate(this._amount);
  }
}
