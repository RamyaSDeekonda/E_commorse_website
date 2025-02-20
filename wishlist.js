let wishlist = [];
const wishlistButton = document.getElementById('wishlist-button');
const wishlistModal = document.getElementById('wishlist-modal');
const closeWishlistButton = document.getElementById('close-wishlist');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const wishlistCount = document.getElementById('wishlist-count');
const wishlistButtons = document.querySelectorAll('.wishlist-button');

// Add click event to all wishlist buttons
wishlistButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.product-card');
        const productName = product.querySelector('h3').textContent;
        const productPrice = parseInt(product.querySelector('p').textContent.replace('₹', '').replace(',', ''));
        const productImage = product.querySelector('img').src;
        const heartIcon = button.querySelector('i');
        
        if (heartIcon.classList.contains('far')) {
            addToWishlist({
                name: productName,
                price: productPrice,
                image: productImage
            });
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        } else {
            removeFromWishlist(productName);
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
        }
    });
});

// Add to Wishlist function
function addToWishlist(product) {
    if (!wishlist.find(item => item.name === product.name)) {
        wishlist.push(product);
        updateWishlistCount();
        updateWishlistDisplay();
    }
}

// Update wishlist count
function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// Update wishlist display
function updateWishlistDisplay() {
    wishlistItemsContainer.innerHTML = '';

    wishlist.forEach(item => {
        wishlistItemsContainer.innerHTML += `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <button class="move-to-cart" onclick="moveToCart('${item.name}')">Add to Cart</button>
                </div>
                <button onclick="removeFromWishlist('${item.name}')" class="remove-wishlist">×</button>
            </div>
        `;
    });
}

// Remove from wishlist
function removeFromWishlist(productName) {
    wishlist = wishlist.filter(item => item.name !== productName);
    updateWishlistCount();
    updateWishlistDisplay();
    
    // Update heart icon
    const productCard = document.querySelector(`.product-card h3[text="${productName}"]`).closest('.product-card');
    const heartIcon = productCard.querySelector('.wishlist-button i');
    heartIcon.classList.remove('fas');
    heartIcon.classList.add('far');
}

// Move to cart
function moveToCart(productName) {
    const item = wishlist.find(item => item.name === productName);
    if (item) {
        addToCart({
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
        removeFromWishlist(productName);
    }
}

// Modal controls
wishlistButton.addEventListener('click', (e) => {
    e.preventDefault();
    wishlistModal.style.display = 'block';
});

closeWishlistButton.addEventListener('click', () => {
    wishlistModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === wishlistModal) {
        wishlistModal.style.display = 'none';
    }
}); 