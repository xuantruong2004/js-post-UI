import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setTextContent } from './utils';

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// author: "Kenya Gusikowski"
// createdAt: 1633700485639
// description: "aut consequatur qui voluptatibus eos sed aspernatur expedita assumenda debitis perspiciatis at vel et rerum totam exercitationem deleniti molestiae similique perspiciatis ut qui fuga voluptatibus temporibus et magnam asperiores quia quibusdam provident vitae voluptate libero rem repudiandae corrupti ut cupiditate ea aut facere assumenda assumenda magni numquam eveniet cumque unde"
// id: "sktwi1cgkkuif36du"
// imageUrl: "https://picsum.photos/id/274/1368/400"
// title: "Voluptate mollitia"
// updatedAt: 1633700485639

function renderPostDetail(post) {
  if (!post) return;

  // render title
  // render description
  // render author
  // render updatedAt

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);

  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  );
  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url(${post.imageUrl})`;
    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbail';
    });
  }

  //   render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
  }
}

(async () => {
  // get post id from url
  // fetch post detail Api
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }
    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
