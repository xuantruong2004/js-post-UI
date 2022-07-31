import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

async function handlePostFormSubmit(formValues) {
  console.log('onsubmit ', formValues);
  try {
    // check add/edit mode
    // call Api
    // show message success
    const postId = formValues.id ? await postApi.update(formValues) : await postApi.add(formValues);
    toast.success('Save post successfully');
    setTimeout(() => window.location.assign(`/post-detail.html?id=${postId.id}`), 1000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error}`);
  }
}
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    const defaultValue = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          imageUrl: '',
          author: '',
        };
    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('fail to fetch post', error);
  }
})();
