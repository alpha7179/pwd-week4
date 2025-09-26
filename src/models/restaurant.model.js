// src/models/restaurant.model.js
class Restaurant {
  constructor({
    id,
    name,
    category,
    location,
    priceRange,
    rating,
    description,
    recommendedMenu = [],
    likes = 0,
    image = ''
  }) {
    this.id = Number(id);
    this.name = name;
    this.category = category;
    this.location = location;
    this.priceRange = priceRange;
    this.rating = Number(rating);
    this.description = description;
    this.recommendedMenu = [...recommendedMenu];
    this.likes = Number(likes);
    this.image = image;
  }

  updateLikes(likes) {
    this.likes = Number(likes);
    return this;
  }
}

module.exports = Restaurant;