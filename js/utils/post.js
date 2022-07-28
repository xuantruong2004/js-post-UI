import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncate } from './common';

export function createPostElement(post) {
  if (!post) return;

  try {
    // find and clone template
    const postTemplate = document.getElementById('postItemTemplate');
    if (!postTemplate) return;
    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    //  update title, description, author, thumbnail

    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', truncate(post.description, 100));
    setTextContent(liElement, '[data-id="author"]', post.author);

    // calculator time
    dayjs.extend(relativeTime);
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;
    }
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/318x200?text=thumbail';
    });
    // attach events

    return liElement;
  } catch (error) {
    console.log('failed to create post item', error);
  }
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;
  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;
  // clear current list
  ulElement.textContent = '';
  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}