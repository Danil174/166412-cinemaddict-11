import AbstractComponent from "./abstract-component.js";

const extraClass = `--extra`;
const hideClass = `visually-hidden`;

export const createListSectionTemplate = (title, isExtraList) => {
  const classPostfix = isExtraList ? extraClass : ``;
  const hideTitleIfRegularList = isExtraList ? `` : hideClass;
  return (
    `<section class="films-list${classPostfix}">
      <h2 class="films-list__title ${hideTitleIfRegularList}">${title}</h2>

      <div class="films-list__container"></div>
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
