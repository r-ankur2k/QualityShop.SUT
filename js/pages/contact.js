// --- Contact Support & File Upload Page Logic ---

const renderContactPage = async () => {
    await applyNetworkDelay();
    renderNavbar('contact');

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
        const orderIdInput = document.getElementById('order-ref');
        const topicSelect = document.getElementById('topic');
        if (orderIdInput) orderIdInput.value = orderId;
        if (topicSelect) topicSelect.value = 'order-issue';
    }
};

const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const topic = document.getElementById('topic').value;
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('attachment');

    const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : 'None';

    const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);

    showToast(`Support ticket ${ticketId} created successfully!`, 'success');

    const resultBox = document.getElementById('contact-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1" data-test-id="contact-submission-success">
                <p class="font-bold text-sm">Ticket ${ticketId} Received</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Attachment:</strong> <code class="bg-emerald-100 px-1 py-0.5 rounded" data-test-id="uploaded-file-name">${fileName}</code></p>
                <p class="pt-2 text-emerald-700">Our automated support agent will respond shortly.</p>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderContactPage();

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
});
