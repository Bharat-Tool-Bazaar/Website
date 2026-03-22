# Bharat Tool Bazaar - Product Marketplace

A modern, responsive e-commerce marketplace for plumbing components and tools built with HTML, CSS, and vanilla JavaScript.

## Project Structure

```
├── index.html           # Main HTML file with page structure
├── styles.css          # Complete styling with animations
├── script.js           # Dynamic product loading and cart management
├── products_data.json  # Extracted product data (13 categories, 700+ products)
└── README.md          # This file
```

## Features

### ✨ Marketplace Features
- **Dynamic Product Loading**: Automatically loads 700+ products from `products_data.json`
- **13 Product Categories**: UPVC Pipes, PVC Pipes, PPR Pipes, CPVC Pipes, SWR Pipes, Valves, and more
- **Search & Filter**: Sort products by name or price (low to high / high to low)
- **Shopping Cart**: Add/remove items with real-time total calculation
- **WhatsApp Integration**: Send orders directly via WhatsApp with complete cart details
- **Local Storage**: Cart persists across page refreshes

### 🎨 Design Features
- Modern glassmorphic UI with animated backgrounds
- Responsive design (desktop & mobile optimized)
- Smooth page transitions and animations
- Dark theme with accent colors (Orange & Yellow)
- Real-time cart count badge

## Product Data

The marketplace loads product data from **products_data.json**, which contains:

- **13 Product Categories**:
  - CPVC Pipes
  - Freemans Products
  - General Hardware
  - ITM Products
  - Jindal Products
  - PPR Pipes
  - PVC Fittings
  - PVC Pipes
  - Sant Products
  - SWR Pipes
  - Techno Products
  - UPVC Pipes
  - Valves

- **700+ Products** with details:
  - Product Name
  - Price (in Rupees)
  - Specifications

## How to Use

### 1. **View Marketplace**
   - Open `index.html` in a web browser
   - Click "Enter Marketplace" button
   - Browse products by category

### 2. **Shopping**
   - Click "Add to Cart" on any product
   - View cart by clicking the shopping cart icon
   - Remove items as needed
   - Total price updates automatically

### 3. **Checkout**
   - Click "Proceed to Checkout"
   - Enter your delivery address
   - Click "Confirm & Send to WhatsApp"
   - WhatsApp will open with your complete order details
   - Send the message to complete your order

## Technical Details

### JavaScript Functionality

**Product Loading** (`script.js`):
```javascript
// Loads products_data.json automatically
async function init() {
    const response = await fetch('products_data.json');
    const data = await response.json();
    // Transform data and populate categories
}
```

**Cart Management**:
- Add products to cart with price tracking
- Remove items from cart
- Auto-calculate totals
- Save cart to LocalStorage

**WhatsApp Integration**:
- Encodes cart items and delivery address
- Opens WhatsApp with pre-filled message
- Sends to configured phone number: `918860573103`

### Styling (CSS)

- **Color Scheme**:
  - Background: `#0b1120` (Dark Blue)
  - Primary Text: `#f8fafc` (Off White)
  - Accent: `#f97316` (Orange)
  - Secondary Accent: `#facc15` (Yellow)

- **Key Classes**:
  - `.marketplace-header` - Sticky header with cart
  - `.categories-sidebar` - Left sidebar with category buttons
  - `.products-grid` - Grid layout for products
  - `.cart-panel` - Slide-out cart panel
  - `.modal` - Delivery address modal

## File Modifications

**Updated `script.js`**:
- Added async data loading from `products_data.json`
- Replaced hardcoded sample data with real extracted products
- Enhanced price formatting (2 decimal places)
- Added visual feedback when adding items to cart
- Improved product name/specs truncation with tooltips

## Performance Notes

- Products are loaded once on page load
- Cart operations are instant (LocalStorage-based)
- Responsive grid adjusts to screen size
- Optimized CSS animations and transitions

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## WhatsApp Configuration

To change the WhatsApp phone number:
1. Open `script.js`
2. Find: `const phoneNumber = "918860573103";`
3. Replace with your phone number (without + sign)

## Notes

- Product data is automatically extracted from PDF price lists
- Prices are in Indian Rupees (₹)
- All local storage data is cleared after successful checkout
- Images are not included; product names are descriptive

---

**Last Updated**: 2024
**Version**: 1.0
