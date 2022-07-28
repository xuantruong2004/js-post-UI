function showModal(modalElement) {
  const myModal = new window.bootstrap.Modal(modalElement);
  if (myModal) myModal.show();
}
export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // handle click for all imgs --> event delegation
  // img click --> find all imgs with the same album/gallery
  // determine index of selected img
  // show modal with selected img
  // handle pre/next

  // selector
  const imageElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG' || !e.target.dataset.album) return;

    imgList = document.querySelectorAll(`img[data-album="${e.target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === e.target);
    // console.log('imgList', { currentIndex, imgList });
    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
  });
  nextButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
  });
}
