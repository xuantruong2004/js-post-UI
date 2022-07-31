import { randomImageUrl, setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

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
    imageUrl: yup.string().required('please random background Image').url(),
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
    ['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''));
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
function initImage(form) {
  const radioButtons = document.querySelectorAll('[name="image"]');
  if (!radioButtons) return;
  for (const radioButton of radioButtons) {
    radioButton.addEventListener('change', () => {
      const imageRandom = document.getElementById('img-random');
      const imageSource = document.getElementById('img-source');
      if (radioButton.id === 'imageRandom') {
        imageRandom.classList.remove('d-none');
        imageSource.classList.add('d-none');
        initRandomImage(form);
      } else {
        imageRandom.classList.add('d-none');
        imageSource.classList.remove('d-none');
      }
    });
  }
}
export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValue);
  let submitting = false;

  // init event
  initRandomImage(form);
  initImage(form);

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
