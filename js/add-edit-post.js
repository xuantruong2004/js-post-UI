import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedField(formValues) {
  const payload = { ...formValues };
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }
  delete payload.imageSource;
  if (!payload.id) delete payload.id;
  return payload;
}
function jsonToFormData(jsonObject) {
  const formData = new FormData();
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }
  return formData;
}
async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    console.log('submit form parent ', { formValues, payload });
    const formData = jsonToFormData(payload);

    // check add/edit mode
    // call Api
    // show message success
    const postId = formValues.id
      ? await postApi.uploadFormData(formData)
      : await postApi.addFormData(formData);
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
