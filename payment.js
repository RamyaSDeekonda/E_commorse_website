document.addEventListener('DOMContentLoaded', () => {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.getElementById('payment-details');

    // Display order items
    function displayOrderItems() {
        let total = 0;
        orderItems.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            orderItems.innerHTML += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} × ${item.quantity}</p>
                    </div>
                    <div class="item-total">₹${itemTotal}</div>
                </div>
            `;
        });

        orderTotal.textContent = total;
    }

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            showPaymentForm(method.dataset.method);
        });
    });

    // Show payment form based on selected method
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
    window.processPayment = function(method) {
        // Here you would typically integrate with a payment gateway
        alert('Payment successful! Order confirmed.');
        localStorage.removeItem('cart'); // Clear cart after successful payment
        window.location.href = 'index.html'; // Redirect to home page
    };

    // Initialize page
    displayOrderItems();
}); 