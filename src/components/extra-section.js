export const createExtraSectionTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}Top rated</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};
