import { randomImageUrl, setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};
function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues.title);
  setFieldValue(form, '[name="author"]', formValues.author);
  setFieldValue(form, '[name="description"]', formValues.description);

  setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl); //hidden field
  setBackgroundImage(document, '#postHeroImage', formValues.imageUrl);
}
function getFormValues(form) {
  const formValues = {};
  // S2:formData
  const formData = new FormData(form);
  for (let [key, value] of formData) {
    formValues[key] = value;
  }
  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('please random background Image').url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (value) => Boolean(value?.name))
        .test('maxSize-5mb', 'The image is too large (max-5mb)', (value) => {
          const fileSize = value?.size || 0;
          const MAX_SIZE = 5 * 1024 * 1024; //5mb
          return fileSize <= MAX_SIZE;
        }),
    }),
  });
}
function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}
async function validatePostForm(form, formValues) {
  // get errors
  // set errors
  // add was validate class to form element

  try {
    // reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    for (const validationError of error.inner) {
      const name = validationError.path;
      if (errorLog[name]) continue;
      setFieldError(form, name, validationError.message);
      errorLog[name] = true;
    }
  }
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}
function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}
function initRandomImage(form) {
  const buttonRandom = document.getElementById('postChangeImage');
  if (!buttonRandom) return;
  buttonRandom.addEventListener('click', () => {
    // random ID
    const imageUrl = `https://picsum.photos/id/${randomImageUrl(1000)}/1368/400`;
    setFieldValue(form, '[name="imageUrl"]', imageUrl); //hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);

    // upload Url
  });
}
function renderImageSourceControl(form, selectorValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectorValue;
  });
}
function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}
function initUploadImage(form) {
  const uploadImage = form.querySelector('input[name="image"]');
  if (!uploadImage) return console.log('ok');
  uploadImage.addEventListener('change', (event) => {
    // get selected file
    // preview file
    const file = event.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setFieldValue(form, '[name="imageUrl"]', imageUrl); //hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}
export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValue);
  let submitting = false;

  // init event
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = defaultValue.id;
    if (submitting) return;

    showLoading(form);
    submitting = true;
    // get form value
    //  validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);
    hideLoading(form);
    submitting = false;
  });
}
