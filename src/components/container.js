import AbstractComponent from "./abstract-component.js";

export const createContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class ExtraSection extends AbstractComponent {
  getTemplate() {
    return createContainerTemplate();
  }
}
