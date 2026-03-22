document.addEventListener('DOMContentLoaded', async () => {
    // WhatsApp configuration
    const phoneNumber = "918860573103";
    const baseMessage = "Hi, Bharat Tool Bazaar! I want to purchase the following hardware items:\n\n";

    // Category icons mapping
    const categoryIcons = {
        'UPVC Pipes': '🔘',
        'PVC Pipes': '⚡',
        'PVC Fittings': '🔗',
        'PPR Pipes': '🌊',
        'CPVC Pipes': '🔥',
        'SWR Pipes': '💧',
        'SWR Traps & Fittings': '🪠',
        'Valves & Controls': '🔐',
        'Taps & Faucets': '🚰',
        'Fasteners & Hardware': '🔩',
        'Drill Bits & Cutting Tools': '🪚',
        'Hand Tools': '🛠️',
        'Power Tools': '⚙️',
        'Plumbing Accessories': '📦',
        'Safety & Protection': '🦺'
    };

    // Product data embedded directly (no need to fetch)
    const productsData = {
      "UPVC Pipes": {
        "products": [
          { "name": "UPVC Pipe 0.5 Inch (6m)", "price": 280, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 0.75 Inch (6m)", "price": 380, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 1 Inch (6m)", "price": 450, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 1.5 Inch (6m)", "price": 650, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 2 Inch (6m)", "price": 850, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 2.5 Inch (6m)", "price": 1200, "specs": "Class B, 6 meters length" },
          { "name": "UPVC Pipe 3 Inch (6m)", "price": 1450, "specs": "Class B, 6 meters length" }
        ]
      },
      "PVC Pipes": {
        "products": [
          { "name": "PVC Pipe 0.5 Inch (6m)", "price": 220, "specs": "Standard Class, 6 meters" },
          { "name": "PVC Pipe 1 Inch (6m)", "price": 380, "specs": "Standard Class, 6 meters" },
          { "name": "PVC Pipe 1.5 Inch (6m)", "price": 550, "specs": "Standard Class, 6 meters" },
          { "name": "PVC Pipe 2 Inch (6m)", "price": 720, "specs": "Standard Class, 6 meters" },
          { "name": "PVC Pipe 3 Inch (6m)", "price": 1250, "specs": "Standard Class, 6 meters" }
        ]
      },
      "PVC Fittings": {
        "products": [
          { "name": "PVC Tee Junction 0.5 Inch", "price": 35, "specs": "T-shaped connector" },
          { "name": "PVC Tee Junction 1 Inch", "price": 48, "specs": "T-shaped connector" },
          { "name": "PVC 90° Elbow 0.5 Inch", "price": 28, "specs": "Right angle bend" },
          { "name": "PVC 90° Elbow 1 Inch", "price": 42, "specs": "Right angle bend" },
          { "name": "PVC 45° Elbow 1 Inch", "price": 38, "specs": "45 degree bend" },
          { "name": "PVC Union 1 Inch", "price": 65, "specs": "Connector joint" },
          { "name": "PVC Reducer 1.5 to 1 Inch", "price": 45, "specs": "Size reducer" }
        ]
      },
      "PPR Pipes": {
        "products": [
          { "name": "PPR Pipe 20mm (100m)", "price": 2200, "specs": "Hot/Cold water, 100m coil" },
          { "name": "PPR Pipe 25mm (100m)", "price": 3200, "specs": "Hot/Cold water, 100m coil" },
          { "name": "PPR Pipe 32mm (100m)", "price": 4800, "specs": "Hot/Cold water, 100m coil" },
          { "name": "PPR Pipe 40mm (100m)", "price": 6500, "specs": "Hot/Cold water, 100m coil" }
        ]
      },
      "CPVC Pipes": {
        "products": [
          { "name": "CPVC Pipe 0.5 Inch (6m)", "price": 320, "specs": "Hot water rated" },
          { "name": "CPVC Pipe 1 Inch (6m)", "price": 480, "specs": "Hot water rated" },
          { "name": "CPVC Pipe 1.5 Inch (6m)", "price": 680, "specs": "Hot water rated" },
          { "name": "CPVC Pipe 2 Inch (6m)", "price": 920, "specs": "Hot water rated" }
        ]
      },
      "SWR Pipes": {
        "products": [
          { "name": "SWR Pipe 75mm (6m)", "price": 380, "specs": "Soil/Waste/Vent, 6m" },
          { "name": "SWR Pipe 100mm (6m)", "price": 580, "specs": "Soil/Waste/Vent, 6m" },
          { "name": "SWR Pipe 110mm (6m)", "price": 650, "specs": "Soil/Waste/Vent, 6m" },
          { "name": "SWR Pipe 160mm (6m)", "price": 1200, "specs": "Soil/Waste/Vent, 6m" }
        ]
      },
      "SWR Traps & Fittings": {
        "products": [
          { "name": "SWR P-Trap 75mm", "price": 180, "specs": "Water seal trap" },
          { "name": "SWR S-Trap 100mm", "price": 220, "specs": "Water seal trap" },
          { "name": "SWR Bend 90° 110mm", "price": 150, "specs": "Right angle bend" },
          { "name": "SWR Tee Junction 110mm", "price": 160, "specs": "T-shaped connector" },
          { "name": "SWR Access Cap 100mm", "price": 120, "specs": "Inspection cap" }
        ]
      },
      "Valves & Controls": {
        "products": [
          { "name": "Brass Ball Valve 0.5 Inch", "price": 180, "specs": "Full port, handle control" },
          { "name": "Brass Ball Valve 1 Inch", "price": 250, "specs": "Full port, handle control" },
          { "name": "Gate Valve 1 Inch", "price": 320, "specs": "Cast iron body" },
          { "name": "Check Valve 1 Inch", "price": 290, "specs": "One-way flow control" },
          { "name": "Pressure Relief Valve 1 Inch", "price": 450, "specs": "Adjustable pressure" },
          { "name": "Float Valve 1/2 Inch", "price": 220, "specs": "Auto water level control" }
        ]
      },
      "Taps & Faucets": {
        "products": [
          { "name": "Bib Cocak Wall Mounted", "price": 180, "specs": "Garden tap" },
          { "name": "Pillar Tap Brass 1/2 Inch", "price": 250, "specs": "Chrome plated" },
          { "name": "Kitchen Mixer Tap", "price": 450, "specs": "With shower head" },
          { "name": "Wash Basin Tap", "price": 320, "specs": "Ceramic cartridge" },
          { "name": "Bathroom Shower Set", "price": 680, "specs": "Complete with holder" }
        ]
      },
      "Fasteners & Hardware": {
        "products": [
          { "name": "M6 Carriage Bolt (50 pcs)", "price": 120, "specs": "Zinc plated" },
          { "name": "M8 Machine Screw (100 pcs)", "price": 180, "specs": "Stainless steel" },
          { "name": "Wall Plugs (200 pcs)", "price": 85, "specs": "Plastic anchors, mixed sizes" },
          { "name": "Steel Nails (1kg pack)", "price": 95, "specs": "Various sizes" },
          { "name": "Washers Assorted (500 pcs)", "price": 150, "specs": "Steel, mixed sizes" },
          { "name": "Nuts M6-M16 (100 pcs)", "price": 110, "specs": "Hex nuts, zinc plated" }
        ]
      },
      "Drill Bits & Cutting Tools": {
        "products": [
          { "name": "HSS Twist Drill Bit Set (13 pcs)", "price": 280, "specs": "1-6.5mm, metal case" },
          { "name": "Masonry Drill Bit Set (8 pcs)", "price": 320, "specs": "Concrete & brick bits" },
          { "name": "Wood Drill Bit Set (10 pcs)", "price": 220, "specs": "Brad point bits" },
          { "name": "Carbide Hole Saw 30-100mm", "price": 450, "specs": "For tile & glass" },
          { "name": "SDS Plus Hammer Drill Bit Set", "price": 380, "specs": "5 pieces, rotary hammer" }
        ]
      },
      "Hand Tools": {
        "products": [
          { "name": "Adjustable Wrench 8 Inch", "price": 220, "specs": "Chrome plated steel" },
          { "name": "Combination Spanner Set (25 pcs)", "price": 580, "specs": "6-32mm" },
          { "name": "Hammer Head Ball Peen 0.5kg", "price": 280, "specs": "Fiberglass handle" },
          { "name": "Claw Hammer 1.5kg", "price": 350, "specs": "Rubber grip" },
          { "name": "Screwdriver Set (12 pcs)", "price": 420, "specs": "Phillips & Flathead" },
          { "name": "Pliers Combination 8 Inch", "price": 180, "specs": "Drop forged" },
          { "name": "Pipe Wrench 10 Inch", "price": 480, "specs": "Adjustable jaws" }
        ]
      },
      "Power Tools": {
        "products": [
          { "name": "Electric Drill 450W", "price": 1200, "specs": "13mm chuck, variable speed" },
          { "name": "Impact Driver 20V", "price": 2200, "specs": "Brushless motor" },
          { "name": "Angle Grinder 4.5 Inch", "price": 1800, "specs": "950W, with safety guard" },
          { "name": "Jigsaw 600W", "price": 1500, "specs": "Variable speed" },
          { "name": "Circular Saw 7.25 Inch", "price": 1900, "specs": "1800W, laser guide" }
        ]
      },
      "Plumbing Accessories": {
        "products": [
          { "name": "PTFE Tape Roll 12mm x 10m", "price": 65, "specs": "Thread seal tape" },
          { "name": "Plumber's Putty 100g", "price": 85, "specs": "Waterproof sealant" },
          { "name": "Silicone Sealant 280ml", "price": 120, "specs": "Antifungal" },
          { "name": "Pipe Insulation Foam 13mm", "price": 380, "specs": "Per meter, 2m length" },
          { "name": "Water Meter 0.5 Inch", "price": 1200, "specs": "Brass body" },
          { "name": "Pressure Gauge 0-10 Bar", "price": 450, "specs": "With connector" }
        ]
      },
      "Safety & Protection": {
        "products": [
          { "name": "Safety Helmet Yellow", "price": 180, "specs": "Adjustable strap" },
          { "name": "Work Gloves Cotton (Pair)", "price": 95, "specs": "Polyester coated" },
          { "name": "Safety Glasses UV", "price": 140, "specs": "Anti-scratch coating" },
          { "name": "Respirator Mask (Box of 50)", "price": 280, "specs": "Dust protection" },
          { "name": "Safety Boot Steel Toe", "price": 850, "specs": "Oil resistant sole" }
        ]
      }
    };

    // Load products from embedded data
    let productCategories = {};
    
    function loadProducts() {
        try {
            const data = productsData;
            
            // Transform data to match our format
            Object.keys(data).forEach(category => {
                const categoryData = data[category];
                
                productCategories[category] = {
                    icon: categoryIcons[category] || '📦',
                    products: (categoryData.products || []).map((product, index) => ({
                        id: `${category}-${index}`,
                        name: product.name,
                        price: product.price,
                        specs: product.specs || 'Not specified'
                    }))
                };
            });
            return true;
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to empty categories
            Object.keys(categoryIcons).forEach(category => {
                productCategories[category] = { icon: categoryIcons[category], products: [] };
            });
            return false;
        }
    }

    // DOM Elements
    const homePage = document.getElementById('home-page');
    const marketplacePage = document.getElementById('marketplace-page');
    const enterMarketplaceBtn = document.getElementById('enter-marketplace-btn');
    const homeBtn = document.getElementById('home-btn');
    const categoriesList = document.getElementById('categories-list');
    const productsGrid = document.getElementById('products-grid');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartPanel = document.getElementById('close-cart-panel');
    const cartCount = document.getElementById('cart-count');
    const cartItemsPanel = document.getElementById('cart-items-panel');
    const totalPricePanel = document.getElementById('total-price-panel');
    const proceedBtn = document.getElementById('proceed-btn');
    const sortBy = document.getElementById('sort-by');
    const categoryTitle = document.getElementById('category-title');
    const addressModal = document.getElementById('address-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelAddress = document.getElementById('cancel-address');
    const addressForm = document.getElementById('address-form');
    const deliveryAddress = document.getElementById('delivery-address');

    // State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentCategory = null;

    // Initialize
    function init() {
        loadProducts();
        renderCategories();
        const firstCategory = Object.keys(productCategories)[0];
        
        if (firstCategory) {
            renderProducts(firstCategory);
        }
        updateCart();
        attachEventListeners();
    }
    
    // Start initialization immediately
    init();

    // Render Categories
    function renderCategories() {
        categoriesList.innerHTML = '';
        Object.keys(productCategories).forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category;
            btn.addEventListener('click', () => {
                renderProducts(category);
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            categoriesList.appendChild(btn);
        });
        // Set first category as active
        categoriesList.querySelector('.category-btn').classList.add('active');
    }

    // Render Products
    function renderProducts(category) {
        currentCategory = category;
        categoryTitle.textContent = category;
        
        if (!productCategories[category] || !productCategories[category].products) {
            productsGrid.innerHTML = '<p style="color: var(--text-secondary);">No products available in this category.</p>';
            return;
        }
        
        const products = productCategories[category].products;
        const sorted = sortProducts(products, sortBy.value);
        
        productsGrid.innerHTML = '';
        sorted.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const displayName = product.name.substring(0, 50) + (product.name.length > 50 ? '...' : '');
            const displaySpecs = product.specs.substring(0, 60) + (product.specs.length > 60 ? '...' : '');
            card.innerHTML = `
                <h3 class="product-name" title="${product.name}">${displayName}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-specs" title="${product.specs}">${displaySpecs}</p>
                <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                    Add to Cart
                </button>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Sort Products
    function sortProducts(products, sortType) {
        const copy = [...products];
        switch(sortType) {
            case 'price-low':
                return copy.sort((a, b) => a.price - b.price);
            case 'price-high':
                return copy.sort((a, b) => b.price - a.price);
            case 'name':
            default:
                return copy.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    // Add to Cart
    productsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price)
            };
            cart.push(product);
            updateCart();
            saveCart();
            // Show notification
            btn.textContent = '✓ Added!';
            btn.style.background = 'var(--accent-orange)';
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.style.background = '';
            }, 1500);
        }
    });

    // Update Cart Display
    function updateCart() {
        cartCount.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsPanel.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            proceedBtn.disabled = true;
            totalPricePanel.textContent = 'Total: ₹0.00';
        } else {
            cartItemsPanel.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item-panel';
                cartItem.innerHTML = `
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">₹${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                `;
                cartItemsPanel.appendChild(cartItem);
            });
            proceedBtn.disabled = false;
            totalPricePanel.textContent = `Total: ₹${total.toFixed(2)}`;
        }
    }

    // Remove from Cart
    cartItemsPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-item-btn');
        if (btn) {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            updateCart();
            saveCart();
        }
    });

    // Save Cart to LocalStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Page Navigation
    enterMarketplaceBtn.addEventListener('click', () => {
        homePage.classList.remove('active');
        marketplacePage.classList.add('active');
    });

    // Home button to go back
    homeBtn.addEventListener('click', () => {
        marketplacePage.classList.remove('active');
        homePage.classList.add('active');
        cartPanel.classList.remove('open');
    });

    // Cart Panel
    cartIconBtn.addEventListener('click', () => {
        cartPanel.classList.toggle('open');
    });

    closeCartPanel.addEventListener('click', () => {
        cartPanel.classList.remove('open');
    });

    // Proceed to Checkout
    proceedBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartPanel.classList.remove('open');
            addressModal.classList.add('active');
            deliveryAddress.focus();
        }
    });

    // Address Modal
    closeModal.addEventListener('click', () => {
        addressModal.classList.remove('active');
    });

    cancelAddress.addEventListener('click', () => {
        addressModal.classList.remove('active');
        addressForm.reset();
    });

    addressModal.addEventListener('click', (e) => {
        if (e.target === addressModal) {
            addressModal.classList.remove('active');
        }
    });

    // Handle Address Form Submission
    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = deliveryAddress.value.trim();
        
        if (address) {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            let message = baseMessage;
            
            cart.forEach(item => {
                message += `- ${item.name}: ₹${item.price.toFixed(2)}\n`;
            });
            
            message += `\n**Total: ₹${total.toFixed(2)}**\n\n`;
            message += `**Delivery Address:**\n${address}\n\n`;
            message += `Please confirm availability and delivery details.`;
            
            const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
            
            // Clear cart and reset
            cart = [];
            saveCart();
            updateCart();
            addressModal.classList.remove('active');
            addressForm.reset();
        }
    });

    // Sort Change
    sortBy.addEventListener('change', () => {
        if (currentCategory) {
            renderProducts(currentCategory);
        }
    });

    // Attach Event Listeners
    function attachEventListeners() {
        // Already handled above
    }

    // Start
    init();
});
