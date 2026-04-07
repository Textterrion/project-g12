export function renderCategories(categories) {
  const categoryList = document.querySelector('.filter-list');
  if (!categoryList) return;

  const markupCategoryAll = `
    <li class="category-item">
      <button type="button" class="category-btn" data-category-id="all">
        <img src="/img/categories/all.jpg" alt="Всі товари" class="category-image" />
        <p>Всі товари</p>
      </button>
    </li>`;

  const markupCategories = categories
    .map(
      category => `
      <li class="category-item">
        <button type="button" class="category-btn" data-category-id="${category._id}">
          <img
          srcset="/img/categories/${category._id}.jpg 1x, /img/categories/${category._id}@2x.jpg 2x, 
          src="/img/categories/${category._id}.jpg" alt="${category.name}" class="category-image" />
          <p>${category.name}</p>
        </button>
      </li>`
    )
    .join('');

  categoryList.innerHTML = markupCategoryAll + markupCategories;
}

export function renderProducts(products, append = false, itemsPerPage = 8) {
  const productList = document.querySelector('.card-list');
  const loadMoreBtn = document.querySelector('.more-btn');
  if (!productList) return;

  const markupProducts = products
    .map(
      product => `
    <li class="card-list-item">
      <img class="card-img-placeholder" src="${product.images[0]}" alt="${product.name}" />
      <div class="card-content">
        <h3 class="card-title">${product.name}</h3>
        <div class="card-colors">
          ${product.color.map(c => `<span class="color-dot" style="background-color: ${c};"></span>`).join('')}
        </div>
        <p class="card-price">${product.price} грн</p>
        <button class="card-btn" data-product-id="${product._id}">Детальніше</button>
      </div>
    </li>`
    )
    .join('');

  if (append) {
    productList.insertAdjacentHTML('beforeend', markupProducts);
  } else {
    productList.innerHTML = markupProducts;
  }

  // Керування видимістю кнопки "Load More"
  if (products.length < itemsPerPage) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

export function renderProductDetails(product) {
  const modalFurniture = document.querySelector('.modal-furniture');
  const imagesList = modalFurniture.querySelector('.images-furniture');
  const infoContainer = modalFurniture.querySelector('.furniture-info');

  // Тільки рендер контенту
  imagesList.innerHTML = product.images
    .map(
      img =>
        `<li><img src="${img}" alt="${product.name}" class="modal-img" /></li>`
    )
    .join('');

  infoContainer.innerHTML = `
    <h2 id="furnitureModalTitle">${product.name}</h2>
    <p class="modal-category">${product.category?.name || 'Меблі'}</p>
    <p class="modal-price">${product.price} грн</p>
    <span class="modal-furniture-rate" data-rate="${product.rate}" style="--rating-percent: ${product.rate * 20}%"></span>
    <div class="modal-colors">
       ${product.color.map(c => `<input type="radio" class="color-dot" name="color" value="${c}" style="background-color: ${c}"></input>`).join('')}
    </div>
    <p class="modal-description">${product.description || ''}</p>
    <button class="add-to-cart-btn"
            data-product-id="${product._id}"
            data-product-color="${product.color[0]}"
      Перейти до замовлення
    </button>
  `;

  modalFurniture.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}