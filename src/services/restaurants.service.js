// src/services/restaurants.service.js
const path = require('path');
const { readFile } = require('fs/promises');
const { readFileSync } = require('fs');
const Restaurant = require('../models/restaurant.model');

const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
let restaurantCache = loadRestaurantsSync();

function loadRestaurantsSync() {
  const raw = readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function loadRestaurantsAsync() {
  const raw = await readFile(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function ensureCache() {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = await loadRestaurantsAsync();
  }
  return restaurantCache;
}

function nextRestaurantId() {
  return restaurantCache.reduce((max, restaurant) => Math.max(max, restaurant.id), 0) + 1;
}

function cloneCollection(collection) {
  return collection.map((restaurant) => new Restaurant(restaurant));
}

// Simulates non-blocking I/O latency so students can compare async vs sync flows.
async function simulateLatency(delayInMs = 20) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

async function getAllRestaurants() {
  await ensureCache();
  await simulateLatency();
  return cloneCollection(restaurantCache);
}

function getAllRestaurantsSync() {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = loadRestaurantsSync();
  }
  return cloneCollection(restaurantCache);
}

async function getRestaurantById(id) {
  await ensureCache();
  await simulateLatency();
  const numericId = Number(id);
  return restaurantCache.find((restaurant) => restaurant.id === numericId) || null;
}

async function getPopularRestaurants(limit = 5) {
  const restaurants = await getAllRestaurants();
  return restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

async function createRestaurant(payload) {
  await ensureCache();
  await simulateLatency();

  const requiredFields = ['name', 'category', 'location'];
  const missingField = requiredFields.find((field) => !payload[field]);

  if (missingField) {
    const error = new Error(`'${missingField}' is required`);
    error.statusCode = 400;
    throw error;
  }

  const restaurant = new Restaurant({
    id: nextRestaurantId(),
    name: payload.name,
    category: payload.category,
    location: payload.location,
    priceRange: payload.priceRange ?? '정보 없음',
    rating: payload.rating ?? 0,
    description: payload.description ?? '',
    recommendedMenu: payload.recommendedMenu ?? [],
    likes: 0,
    image: payload.image ?? ''
  });

  restaurantCache = [...restaurantCache, restaurant];
  return new Restaurant(restaurant);
}

function resetStore() {
  restaurantCache = loadRestaurantsSync();
}

module.exports = {
  getAllRestaurants,
  getAllRestaurantsSync,
  getRestaurantById,
  getPopularRestaurants,
  createRestaurant,
  resetStore,
  loadRestaurantsSync,
  loadRestaurantsAsync,
};