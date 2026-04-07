'use strict';

import axios from 'axios';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export const apiFetch = axios.create({
  baseURL: 'https://furniture-store-v2.b.goit.study/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchCategories() {
  try {
    const response = await apiFetch.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch categories. Please try again later.',
    });
    throw error;
  }
}

export async function fetchProducts(page = 1, limit = 8) {
  try {
    const response = await apiFetch.get(`/furnitures?limit=${limit}&page=${page}`);
    return response.data.furnitures;
  } catch (error) {
    console.error('Error fetching products:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch products. Please try again later.',
    });
    throw error;
  }
}

export async function fetchProductsByCategory(categoryId) {
  try {
    const response = await apiFetch.get(`/furnitures?category=${categoryId}&limit=8`);
    return response.data.furnitures;
  } catch (error) {
    console.error(
      `Error fetching products for category ID ${categoryId}:`,
      error
    );
    iziToast.error({
      title: 'Error',
      message:
        'Failed to fetch products for this category. Please try again later.',
    });
    throw error;
  }
}

export async function fetchProductById(productId) {
  try {
    const response = await apiFetch.get(`/furnitures/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch product details. Please try again later.',
    });
    throw error;
  }
}

export async function fetchPopularProducts() {
  try {
    const response = await apiFetch.get('/furnitures?type=popular&limit=30');
    return response.data.furnitures;
  } catch (error) {
    console.error('Error fetching popular products:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch popular products. Please try again later.',
    });
    throw error;
  }
}

export async function fetchFeedbacks() {
  try {
    const response = await apiFetch.get('/feedbacks?limit=25');
    return response.data.feedbacks;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch feedbacks. Please try again later.',
    });
    throw error;
  }
}

export async function postOrder(orderData) {
  try {
    const response = await apiFetch.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error posting order:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to submit order. Please try again later.',
    });
    throw error;
  }
}