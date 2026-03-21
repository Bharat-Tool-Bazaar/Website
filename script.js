document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp configuration
    const phoneNumber = "918860573103"; // Provided by user
    const defaultMessage = "Hi, Bharat Tool Bazaar I need some equipment.";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    // UI Elements
    const floatingBtn = document.getElementById('floating-wa-btn');
    const heroBtn = document.getElementById('open-whatsapp-hero');

    // Event Listeners for direct redirect
    floatingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(waUrl, '_blank');
    });

    heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(waUrl, '_blank');
    });
});
