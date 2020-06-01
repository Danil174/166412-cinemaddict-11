import AbstractComponent from "./abstract-component.js";

export const createEmptyListTemplate = (title) => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class EmptyList extends AbstractComponent {
  constructor(title) {
    super();

    this._title = title;
  }
  getTemplate() {
    return createEmptyListTemplate(this._title);
  }
}
