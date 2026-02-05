// script.js
// Gallery data (you can also load this from a JSON file)
const galleryData = [
    {
        id: 1,
        image: "assets/images/math-fun.jpg",
        title: "Math Fun with Blocks",
        description: "Learning addition and subtraction with colorful building blocks!",
        category: "math"
    },
    {
        id: 2,
        image: "assets/images/work3.jpg.jpeg",
        title: "Reading Circle",
        description: "Story time and reading practice in our cozy learning corner!",
        category: "reading"
    },
    {
        id: 3,
        image: "assets/images/work4.jpg.jpeg",
        title: "Science Experiments",
        description: "Hands-on learning with safe and exciting science activities!",
        category: "science"
    },
    {
        id: 4,
        image: "assets/images/work5.jpg.jpeg",
        title: "Art & Craft Session",
        description: "Creative projects that make learning colorful and fun!",
        category: "creative"
    },
    {
        id: 5,
        image: "assets/images/work6.jpg.jpeg",
        title: "Homework Help",
        description: "Patient, one-on-one support with school assignments!",
        category: "math"
    },
    {
        id: 6,
        image: "assets/images/work7.jpg.jpeg",
        title: "Group Learning",
        description: "Collaborative activities that build teamwork and social skills!",
        category: "reading"
    }
    // Add more images as needed
];

// Page content loader
async function loadPage(pageId) {
    try {
        const response = await fetch(`pages/${pageId}.html`);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error loading page:', error);
        return '<div class="container"><h2>Page not found</h2><p>Sorry, the requested page could not be loaded.</p></div>';
    }
}

// Main application
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const pageContainer = document.getElementById('page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    
    let currentPage = 'home';
    
    // Initialize app
    initApp();
    
    async function initApp() {
        // Load initial page
        await showPage('home');
        
        // Setup navigation
        setupNavigation();
        
        // Setup lightbox
        setupLightbox();
        
        // Setup form submission
        setupForms();
        
        // Setup animations
        setupAnimations();
    }
    
    async function showPage(pageId) {
        // Update current page
        currentPage = pageId;
        
        // Update navigation active state
        updateNavigation(pageId);
        
        // Load page content
        const pageContent = await loadPage(pageId);
        pageContainer.innerHTML = pageContent;
        pageContainer.className = 'page-content';
        
        // Initialize page-specific functionality
        if (pageId === 'gallery') {
            initializeGallery();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Trigger animations
        setTimeout(() => {
            animatePageElements();
        }, 100);
    }
    
    function updateNavigation(pageId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }
    
    function setupNavigation() {
        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', async function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                await showPage(pageId);
                
                // Update URL
                window.history.pushState({ page: pageId }, '', `#${pageId}`);
                
                // Close mobile menu
                mainNav.classList.remove('active');
            });
        });
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
                mainNav.classList.remove('active');
            }
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', async function(e) {
            const hash = window.location.hash.substring(1) || 'home';
            await showPage(hash);
        });
        
        // Check for initial hash
        const initialHash = window.location.hash.substring(1);
        if (initialHash) {
            showPage(initialHash);
        }
    }
    
    function initializeGallery() {
        const galleryContainer = document.getElementById('photoGallery');
        const galleryFilters = document.querySelectorAll('.gallery-filter');
        
        if (!galleryContainer) return;
        
        // Render gallery
        renderGallery(galleryContainer);
        
        // Setup filters
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Update active filter
                galleryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery
                const filterValue = this.dataset.filter;
                renderGallery(galleryContainer, filterValue);
            });
        });
    }
    
    function renderGallery(container, filter = 'all') {
        container.innerHTML = '';
        
        const filteredData = filter === 'all' 
            ? galleryData 
            : galleryData.filter(item => item.category === filter);
        
        filteredData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.category = item.category;
            
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="gallery-img" data-id="${item.id}">
                <div class="gallery-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            container.appendChild(galleryItem);
            
            // Add click event to gallery images
            const imgElement = galleryItem.querySelector('.gallery-img');
            imgElement.addEventListener('click', () => openLightbox(item));
        });
        
        // Animate gallery items
        animatePageElements();
    }
    
    function setupLightbox() {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
    
    function openLightbox(item) {
        lightboxImage.src = item.image;
        lightboxImage.alt = item.title;
        lightboxCaption.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
        lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function setupForms() {
        // Booking form submission (delegated event)
        document.addEventListener('submit', function(e) {
            if (e.target.id === 'bookingForm') {
                e.preventDefault();
                handleBookingForm();
            }
        });
        
        // WhatsApp click handler
        const whatsappLink = document.querySelector('a[href*="whatsapp"]');
        if (whatsappLink) {
            whatsappLink.addEventListener('click', function(e) {
                const messages = [
                    "Hi Teacher Sindi! I saw your fun tutoring website and I'm interested in learning more about your sessions!",
                    "Hello Sindi! My child could use some fun learning help. Can you tell me more about your tutoring?",
                    "Hi! Your tutoring looks so colorful and fun! I'd love to know more about sessions for my child."
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                this.href = `https://wa.me/27659019828?text=${encodeURIComponent(randomMessage)}`;
            });
        }
    }
    
    function handleBookingForm() {
        const name = document.getElementById('name')?.value;
        
        if (!name) {
            alert('Please enter the student\'s name!');
            return;
        }
        
        const messages = [
            `Yay! Thank you, ${name}! Your learning adventure request has been received! 🎉`,
            `Awesome! ${name}'s tutoring request is on its way to Teacher Sindi! 📚`,
            `Fantastic! ${name} is one step closer to fun learning! I'll contact you soon! ✨`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        alert(randomMessage + "\n\nI'll contact you via WhatsApp within 24 hours to schedule your first fun session!");
        
        // Reset form
        document.getElementById('bookingForm')?.reset();
    }
    
    function setupAnimations() {
        // Add confetti animation to CTA buttons (delegated event)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('cta-button')) {
                createConfetti();
            }
        });
        
        // Add fall animation for confetti
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function animatePageElements() {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotate(0deg)';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe cards and gallery items
        document.querySelectorAll('.service-card, .testimonial-card, .gallery-item').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) rotate(5deg)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    function createConfetti() {
        for(let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.innerHTML = ['🎉', '✨', '🌟', '🎈', '📚'][Math.floor(Math.random() * 5)];
                confetti.style.position = 'fixed';
                confetti.style.fontSize = '1.5rem';
                confetti.style.zIndex = '1000';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '0';
                confetti.style.animation = `fall ${1 + Math.random()}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 2000);
            }, i * 100);
        }
    }
});
