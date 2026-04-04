/**
 * Per-restaurant menu data.
 * Each restaurant has its own set of 4 menu page images with unique
 * category labels that match its cuisine type.
 *
 * Images live in /public/menus/<restaurant-id>-<1-4>.png
 */

const RESTAURANT_MENUS = {
  'saffron-room': {
    pages: [
      { src: '/menus/saffron-room-1.png', label: 'Starters' },
      { src: '/menus/saffron-room-2.png', label: 'Main Course' },
      { src: '/menus/saffron-room-3.png', label: 'Desserts' },
      { src: '/menus/saffron-room-4.png', label: 'Beverages' },
    ],
  },
  'coastal-plate': {
    pages: [
      { src: '/menus/coastal-plate-1.png', label: 'Starters' },
      { src: '/menus/coastal-plate-2.png', label: 'Main Course' },
      { src: '/menus/coastal-plate-3.png', label: 'Desserts' },
      { src: '/menus/coastal-plate-4.png', label: 'Beverages' },
    ],
  },
  'osteria-nove': {
    pages: [
      { src: '/menus/osteria-nove-1.png', label: 'Antipasti' },
      { src: '/menus/osteria-nove-2.png', label: 'Primi & Secondi' },
      { src: '/menus/osteria-nove-3.png', label: 'Dolci' },
      { src: '/menus/osteria-nove-4.png', label: 'Bevande' },
    ],
  },
  'ember-grill': {
    pages: [
      { src: '/menus/ember-grill-1.png', label: 'Starters' },
      { src: '/menus/ember-grill-2.png', label: 'From the Grill' },
      { src: '/menus/ember-grill-3.png', label: 'Desserts' },
      { src: '/menus/ember-grill-4.png', label: 'Drinks' },
    ],
  },
  'sakura-izakaya': {
    pages: [
      { src: '/menus/sakura-izakaya-1.png', label: 'Small Plates' },
      { src: '/menus/sakura-izakaya-2.png', label: 'Ramen & Rice' },
      { src: '/menus/sakura-izakaya-3.png', label: 'Desserts' },
      { src: '/menus/sakura-izakaya-4.png', label: 'Sake & Drinks' },
    ],
  },
  'basil-bistro': {
    pages: [
      { src: '/menus/basil-bistro-1.png', label: 'Mezze' },
      { src: '/menus/basil-bistro-2.png', label: 'Grills & Mains' },
      { src: '/menus/basil-bistro-3.png', label: 'Sweets' },
      { src: '/menus/basil-bistro-4.png', label: 'Beverages' },
    ],
  },
  'midnight-tacos': {
    pages: [
      { src: '/menus/midnight-tacos-1.png', label: 'Antojitos' },
      { src: '/menus/midnight-tacos-2.png', label: 'Tacos & Burritos' },
      { src: '/menus/midnight-tacos-3.png', label: 'Postres' },
      { src: '/menus/midnight-tacos-4.png', label: 'Aguas & Cocktails' },
    ],
  },
  'lotus-garden': {
    pages: [
      { src: '/menus/lotus-garden-1.png', label: 'Dim Sum' },
      { src: '/menus/lotus-garden-2.png', label: 'Wok & Curries' },
      { src: '/menus/lotus-garden-3.png', label: 'Desserts' },
      { src: '/menus/lotus-garden-4.png', label: 'Tea & Drinks' },
    ],
  },
}

export function getMenuForRestaurant(restaurantId) {
  return RESTAURANT_MENUS[restaurantId] ?? null
}
