let cart = [];
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeButton = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const buyButtons = document.querySelectorAll('.buy-button');
const paymentModal = document.getElementById('payment-modal');
const closePaymentButton = document.getElementById('close-payment');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentDetails = document.getElementById('payment-details');
const paymentTotal = document.getElementById('payment-total');

// Add click event to all "Add to Cart" buttons
buyButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const product = button.parentElement;
        const productName = product.querySelector('h3').textContent;
        const productPrice = parseInt(product.querySelector('p').textContent.replace('₹', '').replace(',', ''));
        const productImage = product.querySelector('img').src;
        
        addToCart({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    });
});

// Add to Cart function
function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
    updateCartDisplay();
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.name}')" class="remove-button">×</button>
            </div>
        `;
    });

    cartTotal.textContent = total;
}

// Update quantity
function updateQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    updateCartDisplay();
}

// Modal controls
cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButton = document.getElementById('authButton');
    
    if (isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        authButton.innerHTML = `
            <a href="#" onclick="logout(event)">Logout (${userEmail})</a>
        `;
    } else {
        authButton.innerHTML = '<a href="login.html">Login</a>';
    }
}

function logout(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    checkAuth();
}

// Update the checkout button click handler
checkoutButton.addEventListener('click', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    
    if (cart.length > 0) {
        // Store cart data and redirect to payment page
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    } else {
        alert('Your cart is empty!');
    }
});

// Call checkAuth when the page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        // Remove selected class from all methods
        paymentMethods.forEach(m => m.classList.remove('selected'));
        // Add selected class to clicked method
        method.classList.add('selected');
        
        // Show appropriate payment form
        const paymentType = method.dataset.method;
        showPaymentForm(paymentType);
    });
});

// Close payment modal
closePaymentButton.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// Handle payment form display
function showPaymentForm(paymentType) {
    switch(paymentType) {
        case 'upi':
            paymentDetails.innerHTML = `
                <div class="payment-form active">
                    <div class="upi-options">
                        <div class="upi-option">
                            <img src="gpay.png" alt="Google Pay">
                            <span>Google Pay</span>
                        </div>
                        <div class="upi-option">
                            <img src="phonepe.png" alt="PhonePe">
                            <span>PhonePe</span>
                        </div>
                        <div class="upi-option">
                            <img src="paytm.png" alt="Paytm">
                            <span>Paytm</span>
                        </div>
                    </div>
                    <input type="text" placeholder="Enter UPI ID" required>
                    <button class="payment-button" onclick="processPayment('upi')">Pay Now</button>
                </div>
            `;
            break;
            
        case 'card':
            paymentDetails.innerHTML = `
                <div class="payment-form active">
                    <input type="text" placeholder="Card Number" required>
                    <div class="card-row">
                        <input type="text" placeholder="MM/YY" required>
                        <input type="text" placeholder="CVV" required>
                    </div>
                    <input type="text" placeholder="Card Holder Name" required>
                    <button class="payment-button" onclick="processPayment('card')">Pay Now</button>
                </div>
            `;
            break;
            
        case 'netbanking':
            paymentDetails.innerHTML = `
                <div class="payment-form active">
                    <select required>
                        <option value="">Select Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                    </select>
                    <button class="payment-button" onclick="processPayment('netbanking')">Continue to Net Banking</button>
                </div>
            `;
            break;
            
        case 'cod':
            paymentDetails.innerHTML = `
                <div class="payment-form active">
                    <p>Cash on Delivery charges: ₹49</p>
                    <input type="text" placeholder="Delivery Address" required>
                    <button class="payment-button" onclick="processPayment('cod')">Place Order</button>
                </div>
            `;
            break;
    }
}

// Process payment
function processPayment(method) {
    // Here you would typically integrate with a payment gateway
    // For this example, we'll just show a success message
    alert('Payment successful! Order confirmed.');
    cart = [];
    updateCartCount();
    updateCartDisplay();
    paymentModal.style.display = 'none';
}

// Close payment modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
}); 