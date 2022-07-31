import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#0087d7',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#41d888',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },
  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#f94416',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },
};
