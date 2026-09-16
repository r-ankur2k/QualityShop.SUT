// --- User Profile Page Logic ---

const renderProfilePage = async () => {
    await applyNetworkDelay();
    renderNavbar('profile');

    const container = document.getElementById('profile-container');
    if (!container) return;

    const user = State.user || { displayName: 'Test User', email: 'user@test.com', role: 'customer' };

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Left Info Sidebar -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
                <div class="w-24 h-24 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
                    ${user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-900" data-test-id="profile-user-name">${user.displayName}</h2>
                    <p class="text-xs text-slate-500" data-test-id="profile-user-email">${user.email}</p>
                    <span class="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-full text-xs uppercase" data-test-id="profile-user-role">${user.role} Account</span>
                </div>
                <button onclick="handleLogout()" class="w-full mt-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2" data-test-id="profile-logout-btn">
                    <i data-lucide="log-out" class="h-4 w-4"></i> Sign Out
                </button>
            </div>

            <!-- Right Details Section -->
            <div class="md:col-span-2 space-y-6">
                <!-- Saved Addresses -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <i data-lucide="map-pin" class="h-4 w-4 text-indigo-600"></i> Saved Addresses
                    </h3>
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex justify-between items-center" data-test-id="saved-address-default">
                        <div>
                            <span class="font-bold text-slate-900 block">Default Primary Address</span>
                            <p class="mt-1">123 QA Automation Way, Suite 400</p>
                            <p>Austin, TX 78701</p>
                        </div>
                        <span class="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">Primary</span>
                    </div>
                </div>

                <!-- Saved Payment Cards -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <i data-lucide="credit-card" class="h-4 w-4 text-indigo-600"></i> Saved Payment Methods
                    </h3>
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex justify-between items-center" data-test-id="saved-card-default">
                        <div>
                            <span class="font-bold text-slate-900 block">Visa ending in 8892</span>
                            <p class="mt-1">Expires 12/28</p>
                        </div>
                        <span class="px-2 py-1 bg-indigo-100 text-indigo-800 font-bold rounded">Default</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    initIcons();
};

document.addEventListener('DOMContentLoaded', () => {
    renderProfilePage();
});
