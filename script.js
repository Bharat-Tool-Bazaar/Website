document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp configuration
    const phoneNumber = "918860573103"; // Provided by user
    const baseMessage = "Hi, Bharat Tool Bazaar! I want to purchase the following items:\n\n";

    // Sample products
    const products = [
        { id: 1, name: "Hammer", price: 150, icon: "🔨" },
        { id: 2, name: "Screwdriver Set", price: 300, icon: "🔧" },
        { id: 3, name: "Wrench", price: 200, icon: "🔩" },
        { id: 4, name: "Drill", price: 800, icon: "🪛" },
        { id: 5, name: "Pliers", price: 120, icon: "✂️" },
        { id: 6, name: "Tape Measure", price: 100, icon: "📏" }
    ];

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // DOM elements
    const productsGrid = document.getElementById('products-grid');
    const cartItems = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const totalPriceEl = document.getElementById('total-price');
    
    // Modal elements
    const addressModal = document.getElementById('address-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelAddress = document.getElementById('cancel-address');
    const addressForm = document.getElementById('address-form');
    const deliveryAddress = document.getElementById('delivery-address');

    // Render products
    function renderProducts() {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">${product.icon}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <span>Add to Cart</span>
                </button>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // Calculate total price
    function calculateTotal() {
        return cart.reduce((sum, item) => sum + item.price, 0);
    }

    // Render cart
    function renderCart() {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            checkoutBtn.disabled = true;
            totalPriceEl.textContent = 'Total: ₹0';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">₹${item.price}</span>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                `;
                cartItems.appendChild(cartItem);
            });
            checkoutBtn.disabled = false;
            totalPriceEl.textContent = `Total: ₹${calculateTotal()}`;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add to cart
    productsGrid.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart-btn');
        if (button) {
            const productId = parseInt(button.dataset.id);
            const product = products.find(p => p.id === productId);
            cart.push(product);
            renderCart();
        }
    });

    // Remove from cart
    cartItems.addEventListener('click', (e) => {
        const button = e.target.closest('.remove-btn');
        if (button) {
            const index = parseInt(button.dataset.index);
            cart.splice(index, 1);
            renderCart();
        }
    });

    // Checkout - Show address modal
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            addressModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            deliveryAddress.focus(); // Focus on the address field
        }
    });

    // Close modal functions
    function closeAddressModal() {
        addressModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        addressForm.reset();
    }

    closeModal.addEventListener('click', closeAddressModal);
    cancelAddress.addEventListener('click', closeAddressModal);

    // Close modal when clicking outside
    addressModal.addEventListener('click', (e) => {
        if (e.target === addressModal) {
            closeAddressModal();
        }
    });

    // Handle address form submission
    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = deliveryAddress.value.trim();
        
        if (address) {
            const total = calculateTotal();
            let message = baseMessage;
            cart.forEach(item => {
                message += `- ${item.name}: ₹${item.price}\n`;
            });
            message += `\n**Total: ₹${total}**\n\n`;
            message += `**Delivery Address:**\n${address}\n\n`;
            message += `Please confirm availability and delivery details.`;
            
            const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
            
            // Clear cart and close modal
            cart = [];
            renderCart();
            closeAddressModal();
        }
    });

    // Initial render
    renderProducts();
    renderCart();
});
