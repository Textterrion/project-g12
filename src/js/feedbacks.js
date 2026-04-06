'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchFeedbacks } from './fetch.js';

const feedbackList = document.querySelector('.feedback-list');

const initSwiper = () => {
  return new Swiper('.feedbackSwiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 24,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.feedback-button-next',
      prevEl: '.feedback-button-prev',
    },
    pagination: {
      el: '.feedback-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 3,
      },
    },
  });
};

const renderFeedback = async () => {
  try {
    const feedbacks = await fetchFeedbacks();
    if (feedbacks && feedbacks.length > 0) {
      const markup = feedbacks
        .map(
          item => `
        <li class="swiper-slide feedback-item" data-product-id="${item._id}">
        <span class="feedback-rate" data-rate="${item.rate}" style="--rating-percent: ${item.rate * 20}%"></span>
        <p class="feedback-comment">${item.descr}</p>
        <p class="feedback-user">- ${item.name}</p>
        </li>`
        )
        .join('');

      feedbackList.innerHTML = markup;

      // 2. Ініціалізуємо Swiper ТІЛЬКИ ПІСЛЯ того, як додали слайди в DOM
      initSwiper();
    } else {
      feedbackList.innerHTML =
        '<p class="no-feedback">Наразі немає доступу до відгуків</p>';
    }
  } catch (error) {
    iziToast.error({ message: 'Помилка завантаження відгуків' });
  }
};

// 3. Додаємо слухач подій на список слайдера (Делегування)
feedbackList.addEventListener('click', async event => {
  const btn = event.target.closest('.feedback-btn');
  if (!btn) return;

  const productId = btn.dataset.productId; // Використовуй той самий атрибут, що і в основному списку

  // Викликаємо ту саму функцію, що і для основних карток
  if (typeof loadProductDetails === 'function') {
    await loadProductDetails(productId);
  }
});

renderFeedback();
