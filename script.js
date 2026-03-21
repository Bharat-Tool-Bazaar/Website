document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp configuration
    const phoneNumber = "918860573103"; // Provided by user

    // UI Elements
    const floatingBtn = document.getElementById('floating-wa-btn');
    const heroBtn = document.getElementById('open-whatsapp-hero');
    const popup = document.getElementById('whatsapp-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const waForm = document.getElementById('whatsapp-form');
    const requirementText = document.getElementById('requirement-text');

    // Toggle Popup Visibility
    function openPopup() {
        popup.classList.add('active');
        floatingBtn.style.animationPlayState = 'paused';
        requirementText.focus();
    }

    function closePopup() {
        popup.classList.remove('active');
        floatingBtn.style.animationPlayState = 'running';
        
        // Brief timeout to reset form if closed without sending
        setTimeout(() => {
            waForm.reset();
        }, 300);
    }

    // Event Listeners
    floatingBtn.addEventListener('click', () => {
        if (popup.classList.contains('active')) {
            closePopup();
        } else {
            openPopup();
        }
    });

    heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPopup();
    });

    closePopupBtn.addEventListener('click', closePopup);

    // Form Submission
    waForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = requirementText.value.trim();
        
        if (text) {
            // Encode the text for URL
            const urlEncodedText = encodeURIComponent(text);
            const waUrl = `https://wa.me/${phoneNumber}?text=${urlEncodedText}`;
            
            // Open WhatsApp in a new tab
            window.open(waUrl, '_blank');
            
            // Close popup after redirect
            closePopup();
        }
    });

    // Close popup on clicking outside
    document.addEventListener('click', (e) => {
        if (popup.classList.contains('active') && 
            !popup.contains(e.target) && 
            e.target !== floatingBtn && 
            !floatingBtn.contains(e.target) &&
            e.target !== heroBtn &&
            !heroBtn.contains(e.target)) {
            closePopup();
        }
    });
});
