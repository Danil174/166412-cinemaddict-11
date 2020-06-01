import AbstractComponent from "./abstract-component.js";

const createFooterMoviesCounterTemplate = (amount) => {
  return (
    `<section class="footer__statistics">
      <span class="counter">${amount}</span> inside
    </section>`
  );
};

export default class FooterMoviesCounter extends AbstractComponent {
  constructor(amount) {
    super();

    this._amount = amount;
  }

  getTemplate() {
    return createFooterMoviesCounterTemplate(this._amount);
  }

  updateCounter(amount) {
    this.getElement().querySelector(`.counter`).textContent = amount;
  }
}
