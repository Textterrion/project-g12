'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import Swiper from 'swiper';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchPopularProducts } from './fetch.js';
import { loadProductDetails } from './furniture-list.js';

const popularList = document.querySelector('.popular-list');

const initSwiper = () => {
  return new Swiper('.popularSwiper', {
    modules: [Navigation, Pagination, Keyboard],
    slidesPerView: 1,
    spaceBetween: 24,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.popular-button-next',
      prevEl: '.popular-button-prev',
    },
    pagination: {
      el: '.popular-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 4,
      },
    },
  });
};

const renderPopular = async () => {
  try {
    const popularGoods = await fetchPopularProducts();

    if (popularGoods && popularGoods.length > 0) {
      const markup = popularGoods
        .map(
          item => `
        <li class="swiper-slide popular-item">
          <img class="popular-img" src="${item.images[0]}" alt="${item.name}" />
          <div class="popular-info">
            <h3 class="popular-subtitle">${item.name}</h3>
            <div class="popular-colors">
              ${item.color.map(color => `<span class="popular-color" style="background-color: ${color};"></span>`).join('')}
            </div>
            <p class="popular-price">${item.price} грн</p>
          </div>
          <button class="popular-btn card-btn" type="button" data-product-id="${item._id}">Детальніше</button>
        </li>`
        )
        .join('');

      popularList.innerHTML = markup;

      // 2. Ініціалізуємо Swiper ТІЛЬКИ ПІСЛЯ того, як додали слайди в DOM
      initSwiper();
    } else {
      popularList.innerHTML =
        '<p class="no-popular">Наразі немає доступу до популярних товарів</p>';
    }
  } catch (error) {
    iziToast.error({ message: 'Помилка завантаження популярних товарів' });
  }
};

// 3. Додаємо слухач подій на список слайдера (Делегування)
popularList.addEventListener('click', async event => {
  const btn = event.target.closest('.popular-btn');
  if (!btn) return;

  const productId = btn.dataset.productId; // Використовуй той самий атрибут, що і в основному списку

  // Викликаємо ту саму функцію, що і для основних карток
  if (typeof loadProductDetails === 'function') {
    await loadProductDetails(productId);
  }
});

renderPopular();