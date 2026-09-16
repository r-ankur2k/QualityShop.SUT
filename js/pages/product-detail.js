// --- Product Detail Page Logic ---

const getProductReviews = (productId) => {
    if (!State.reviews[productId]) {
        State.reviews[productId] = [
            { id: 'r1', name: 'Sarah Jenkins', rating: 5, date: '2025-05-10', comment: 'Excellent quality product! Exceeded my expectations. Delivery was very fast.' },
            { id: 'r2', name: 'Michael Chen', rating: 4, date: '2025-05-02', comment: 'Great value for the price. Works as advertised.' }
        ];
        saveReviewsToStorage();
    }
    return State.reviews[productId];
};

const renderStars = (rating) => {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return `${fullStars}${emptyStars}`;
};

const renderProductDetailPage = async () => {
    await applyNetworkDelay();
    renderNavbar('products');

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'p1';
    const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    State.currentProduct = product;

    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const inWishlist = State.wishlist.some(w => w.id === product.id);
    const inCompare = State.compare.some(c => c.id === product.id);
    const reviews = getProductReviews(product.id);

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8" data-test-id="product-detail-card">
            <!-- Left Column: Image -->
            <div class="bg-slate-50 rounded-xl p-12 flex items-center justify-center text-9xl select-none relative min-h-[300px]">
                <span>${product.image}</span>
                <span class="absolute top-4 left-4 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full" data-test-id="detail-category">${product.category}</span>
            </div>

            <!-- Right Column: Info -->
            <div class="flex flex-col justify-between space-y-6">
                <div>
                    <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900" data-test-id="detail-title">${product.name}</h1>
                    <div class="flex items-center gap-2 mt-2 text-amber-500 text-sm font-semibold">
                        <span data-test-id="detail-rating">★ ${product.rating}</span>
                        <span class="text-slate-400" data-test-id="detail-review-count">(${reviews.length} customer reviews)</span>
                        <span class="ml-auto text-xs ${product.stock < 10 ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-emerald-100 text-emerald-800'} px-2.5 py-0.5 rounded-full" data-test-id="detail-stock">
                            In Stock: ${product.stock} units
                        </span>
                    </div>

                    <div class="mt-4 pb-4 border-b border-slate-100">
                        <span class="text-3xl font-black text-slate-900" data-test-id="detail-price">$${product.price.toFixed(2)}</span>
                    </div>

                    <p class="mt-4 text-slate-600 text-sm leading-relaxed" data-test-id="detail-description">${product.description}</p>
                </div>

                <!-- Quantity & Actions -->
                <div class="space-y-4 pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-4">
                        <label class="text-xs font-bold text-slate-700 uppercase">Quantity</label>
                        <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                            <button onclick="adjustQuantity(-1)" class="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="qty-minus">-</button>
                            <span id="detail-qty" class="px-4 py-1.5 text-sm font-semibold text-slate-800" data-test-id="detail-qty-value">1</span>
                            <button onclick="adjustQuantity(1)" class="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold" data-test-id="qty-plus">+</button>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button onclick="addCurrentToCart()" class="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2" data-test-id="detail-add-to-cart-btn">
                            <i data-lucide="shopping-cart" class="h-5 w-5"></i> Add to Shopping Cart
                        </button>
                        <button onclick="toggleWishlist('${product.id}')" class="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition" title="Wishlist" data-test-id="detail-wishlist-btn">
                            <i data-lucide="heart" class="${inWishlist ? 'fill-rose-500 text-rose-500' : ''} h-5 w-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Specifications & Customer Reviews Section -->
        <div class="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8" data-test-id="reviews-section">
            <div>
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2" data-test-id="reviews-heading">
                        <i data-lucide="message-square" class="h-5 w-5 text-indigo-600"></i> Customer Reviews
                        <span class="text-sm font-normal text-slate-500" id="reviews-badge">(${reviews.length})</span>
                    </h2>
                </div>

                <div id="reviews-list" class="space-y-4" data-test-id="reviews-list">
                    ${renderReviewsListHtml(reviews)}
                </div>
            </div>

            <!-- Write a Review Form -->
            <div class="pt-6 border-t border-slate-200">
                <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i data-lucide="pen-tool" class="h-4 w-4 text-indigo-600"></i> Write a Customer Review
                </h3>
                <form id="review-form" onsubmit="handleReviewSubmit(event)" class="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200" data-test-id="review-form">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="review-name" class="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Name</label>
                            <input type="text" id="review-name" required value="${State.user ? (State.user.displayName || State.user.name) : ''}" placeholder="e.g. Alex Smith" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" data-test-id="review-name-input">
                        </div>
                        <div>
                            <label for="review-rating" class="block text-xs font-semibold text-slate-700 uppercase mb-1">Rating</label>
                            <select id="review-rating" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" data-test-id="review-rating-select">
                                <option value="5">★★★★★ (5/5 Excellent)</option>
                                <option value="4">★★★★☆ (4/5 Very Good)</option>
                                <option value="3">★★★☆☆ (3/5 Average)</option>
                                <option value="2">★★☆☆☆ (2/5 Poor)</option>
                                <option value="1">★☆☆☆☆ (1/5 Terrible)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="review-text" class="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Review</label>
                        <textarea id="review-text" required rows="3" placeholder="Share details of your experience with this product..." class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" data-test-id="review-text-textarea"></textarea>
                    </div>
                    <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg text-sm transition shadow flex items-center gap-2" data-test-id="submit-review-btn">
                        <i data-lucide="send" class="h-4 w-4"></i> Submit Review
                    </button>
                </form>
            </div>
        </div>
    `;

    initIcons();
};

const renderReviewsListHtml = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return `<p class="text-sm text-slate-500 italic" data-test-id="no-reviews-msg">No reviews yet. Be the first to review this product!</p>`;
    }

    return reviews.map(r => `
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200" data-test-id="review-card-${r.id}">
            <div class="flex items-center justify-between mb-1.5">
                <span class="font-semibold text-sm text-slate-800" data-test-id="review-author">${r.name}</span>
                <span class="text-amber-500 text-xs font-semibold" data-test-id="review-rating">${renderStars(r.rating)} ${r.rating}.0</span>
            </div>
            <p class="text-slate-600 text-xs leading-relaxed" data-test-id="review-text">${r.comment}</p>
            ${r.date ? `<span class="text-[10px] text-slate-400 mt-2 block">${r.date}</span>` : ''}
        </div>
    `).join('');
};

const handleReviewSubmit = async (event) => {
    event.preventDefault();
    await applyNetworkDelay();

    if (!State.currentProduct) return;
    const productId = State.currentProduct.id;

    const nameInput = document.getElementById('review-name');
    const ratingSelect = document.getElementById('review-rating');
    const textInput = document.getElementById('review-text');

    if (!nameInput || !textInput) return;

    const name = nameInput.value.trim();
    const rating = parseInt(ratingSelect.value, 10);
    const comment = textInput.value.trim();

    if (!name || !comment) {
        showToast('Please fill out all required fields', 'warning');
        return;
    }

    const newReview = {
        id: 'r-' + Date.now(),
        name,
        rating,
        date: new Date().toISOString().split('T')[0],
        comment
    };

    if (!State.reviews[productId]) {
        State.reviews[productId] = [];
    }

    State.reviews[productId].unshift(newReview);
    saveReviewsToStorage();

    const reviewsListEl = document.getElementById('reviews-list');
    const reviewsBadgeEl = document.getElementById('reviews-badge');
    const reviews = State.reviews[productId];

    if (reviewsListEl) {
        reviewsListEl.innerHTML = renderReviewsListHtml(reviews);
    }
    if (reviewsBadgeEl) {
        reviewsBadgeEl.textContent = `(${reviews.length})`;
    }

    textInput.value = '';
    showToast('Thank you! Your customer review has been submitted.', 'success');
};

let detailQuantity = 1;

const adjustQuantity = (delta) => {
    detailQuantity = Math.max(1, detailQuantity + delta);
    const qtyValue = document.getElementById('detail-qty');
    if (qtyValue) qtyValue.textContent = detailQuantity;
};

const addCurrentToCart = () => {
    if (!State.currentProduct) return;
    const existing = State.cart.find(item => item.id === State.currentProduct.id);
    if (existing) {
        existing.quantity += detailQuantity;
    } else {
        State.cart.push({ ...State.currentProduct, quantity: detailQuantity });
    }
    saveCartToStorage();
    renderNavbar('products');
    showToast(`Added ${detailQuantity}x ${State.currentProduct.name} to cart`, 'success');
};

document.addEventListener('DOMContentLoaded', () => {
    renderProductDetailPage();
});
