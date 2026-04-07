'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  fetchProductById,
  postOrder,
} from './fetch.js';
import {
  renderCategories,
  renderProducts,
  renderProductDetails,
} from './render-furnitures-block.js';

// Глобальний стан
let currentPage = 1;
const itemsPerPage = 8;
let currentCategoryId = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  // Селектори
  const categoryList = document.querySelector('.filter-list');
  const productList = document.querySelector('.card-list');
  const loadMoreBtn = document.querySelector('.more-btn');
  const modalFurniture = document.querySelector('.modal-furniture');
  const modalOrder = document.querySelector('.modal-order');
  const orderInfoContainer = modalOrder.querySelector('.order-info');

  // Універсальна функція закриття всіх модалок
  const closeAllModals = () => {
    modalFurniture.classList.remove('is-open');
    modalOrder.classList.remove('is-open');
    document.body.style.overflow = 'auto';
  };

  // --- Ініціалізація даних ---
  try {
    const [categories, products] = await Promise.all([
      fetchCategories(),
      fetchProducts(1, itemsPerPage),
    ]);
    renderCategories(categories);
    renderProducts(products, false, itemsPerPage);
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Не вдалося завантажити дані.' });
  }

  // --- Обробники подій ---

  // 1. Перехід з деталей до замовлення
  modalFurniture.addEventListener('click', event => {
    const addToCartBtn = event.target.closest('.add-to-cart-btn');
    if (!addToCartBtn) return;

    const { productId, productName, productPrice, productImg } =
      addToCartBtn.dataset;

    modalFurniture.classList.remove('is-open'); // Закриваємо першу

    orderInfoContainer.innerHTML = `
      <div class="order-preview" data-product-id="${productId}">
        <img src="${productImg}" alt="${productName}" class="order-img" />
        <div class="order-details">
          <h3>${productName}</h3>
          <p class="order-price">До сплати: ${productPrice} грн</p>
        </div>
      </div>
    `;

    modalOrder.classList.add('is-open'); // Відкриваємо другу
  });

  // 2. "Показати ще"
  loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    await loadProducts(currentCategoryId, currentPage, itemsPerPage);
  });

  // 3. Фільтр категорій
  categoryList.addEventListener('click', async event => {
    const btn = event.target.closest('button');
    if (!btn) return;

    currentCategoryId = btn.dataset.categoryId;
    currentPage = 1;
    await loadProducts(currentCategoryId, currentPage, itemsPerPage);
  });

  // 4. Відкриття деталей товару
  productList.addEventListener('click', async event => {
    const btn = event.target.closest('.card-btn');
    if (!btn) return;
    await loadProductDetails(btn.dataset.productId);
  });

  // --- Логіка закриття (Уніфікована) ---

  // Кнопки закриття
  modalFurniture
    .querySelector('.modal-close-btn')
    .addEventListener('click', closeAllModals);
  modalOrder
    .querySelector('.modal-close-btn-order')
    .addEventListener('click', closeAllModals);

  // Клік по фону
  [modalFurniture, modalOrder].forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) closeAllModals();
    });
  });

  // Клавіша Escape
  window.addEventListener('keydown', e => {
    if (e.code === 'Escape') closeAllModals();
  });

  // 5. Обробка сабміту форми замовлення
  const orderForm = modalOrder.querySelector('.order-details');

  orderForm.addEventListener('submit', event => {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки

    // Збираємо дані з полів форми
    const formData = new FormData(orderForm);
    const result = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      comments: formData.get('comments'),
      product: {
        id: orderInfoContainer.querySelector('.order-preview').dataset
          .productId,
        name: orderInfoContainer.querySelector('h3').textContent,
        price: orderInfoContainer
          .querySelector('.order-price')
          .textContent.replace('До сплати: ', '')
          .replace(' грн', ''),
      },
    };

    postOrder(result);
    console.log('Order submitted:', result);

    // Повідомлення користувачу
    iziToast.success({
      title: 'Успіх!',
      message: 'Дякуємо за замовлення! Ми зв’яжемося з вами найближчим часом.',
      position: 'topRight',
    });

    // Очищення форми та закриття модалки
    orderForm.reset();
    closeAllModals();
  });
});

// --- Логічні функції (поза DOMContentLoaded для чистоти) ---

async function loadProducts(categoryId, page, limit) {
  try {
    const products =
      categoryId === 'all'
        ? await fetchProducts(page, limit)
        : await fetchProductsByCategory(categoryId, page, limit);

    renderProducts(products, page > 1, limit);
  } catch (error) {
    iziToast.error({ message: 'Помилка завантаження товарів' });
  }
}

export async function loadProductDetails(productId) {
  try {
    const product = await fetchProductById(productId);
    renderProductDetails(product);
  } catch (error) {
    iziToast.error({ message: 'Не вдалося завантажити деталі' });
  }
}
