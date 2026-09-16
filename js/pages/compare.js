// --- Product Comparison Page Logic ---

const renderComparePage = async () => {
    await applyNetworkDelay();
    renderNavbar('compare');

    const container = document.getElementById('compare-container');
    if (!container) return;

    if (State.compare.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center" data-test-id="empty-compare-state">
                <div class="text-6xl mb-4">⚖️</div>
                <h2 class="text-xl font-bold text-slate-800">No Products Selected for Comparison</h2>
                <p class="text-slate-500 text-sm mt-1">Select up to 4 products from the catalog to compare side-by-side.</p>
                <a href="products.html" class="inline-block mt-6 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md" data-test-id="browse-products-btn">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table class="w-full text-left border-collapse" data-test-id="compare-table">
                <thead>
                    <tr class="border-b border-slate-200 bg-slate-50">
                        <th class="p-4 w-48 text-xs font-bold text-slate-500 uppercase">Features</th>
                        ${State.compare.map(p => `
                            <th class="p-4 min-w-[220px] text-center border-l border-slate-200 relative" data-test-id="compare-header-${p.id}">
                                <button onclick="removeFromCompare('${p.id}')" class="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-full" title="Remove" data-test-id="remove-compare-btn-${p.id}">
                                    <i data-lucide="x" class="h-4 w-4"></i>
                                </button>
                                <div class="text-5xl my-2">${p.image}</div>
                                <h3 class="font-bold text-slate-900 text-sm line-clamp-1">${p.name}</h3>
                                <button onclick="addToCart('${p.id}')" class="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold w-full transition" data-test-id="compare-add-to-cart-btn-${p.id}">
                                    Add to Cart
                                </button>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                    <tr>
                        <td class="p-4 font-bold text-slate-700 bg-slate-50/50">Price</td>
                        ${State.compare.map(p => `<td class="p-4 text-center font-bold text-slate-900 text-sm border-l border-slate-100">$${p.price.toFixed(2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="p-4 font-bold text-slate-700 bg-slate-50/50">Category</td>
                        ${State.compare.map(p => `<td class="p-4 text-center text-slate-600 border-l border-slate-100">${p.category}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="p-4 font-bold text-slate-700 bg-slate-50/50">Rating</td>
                        ${State.compare.map(p => `<td class="p-4 text-center text-amber-500 font-bold border-l border-slate-100">★ ${p.rating} (${p.reviews})</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="p-4 font-bold text-slate-700 bg-slate-50/50">In Stock</td>
                        ${State.compare.map(p => `<td class="p-4 text-center font-semibold border-l border-slate-100 ${p.stock < 10 ? 'text-rose-600' : 'text-emerald-700'}">${p.stock} units</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="p-4 font-bold text-slate-700 bg-slate-50/50">Description</td>
                        ${State.compare.map(p => `<td class="p-4 text-center text-slate-500 border-l border-slate-100 leading-relaxed">${p.description}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    initIcons();
};

const removeFromCompare = (productId) => {
    State.compare = State.compare.filter(c => c.id !== productId);
    saveCompareToStorage();
    showToast('Removed from Compare', 'info');
    renderComparePage();
};

document.addEventListener('DOMContentLoaded', () => {
    renderComparePage();
});
