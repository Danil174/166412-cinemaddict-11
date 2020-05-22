import AbstractComponent from "./abstract-component.js";

const createMoviesCounterTemplate = (amount) => {
  return (
    `<section class="footer__statistics">
      <span class="counter">${amount}</span> inside
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

  updateCounter(amount) {
    this.getElement().querySelector(`.counter`).textContent = amount;
  }
}
