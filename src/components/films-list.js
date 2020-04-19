import AbstractComponent from "./abstract-component.js";

const extraClass = `--extra`;

export const createListSectionTemplate = (title, isExtraList) => {
  const classPostfix = isExtraList ? extraClass : ``;
  return (
    `<section class="films-list${classPostfix}">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class ListSection extends AbstractComponent {
  constructor(title, isExtraLis = false) {
    super();

    this._title = title;
    this._isExtraLis = isExtraLis;
  }

  getTemplate() {
    return createListSectionTemplate(this._title, this._isExtraLis);
  }
}
