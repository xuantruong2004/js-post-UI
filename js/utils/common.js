export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}
export function truncate(text, maxLength) {
  if (text <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
export function setFieldValue(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) field.value = value;
}
export function setBackgroundImage(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) field.style.backgroundImage = `url('${value}')`;
}
export function randomImageUrl(n) {
  if (n <= 0) return 1;
  return Math.floor(Math.random() * n);
}
