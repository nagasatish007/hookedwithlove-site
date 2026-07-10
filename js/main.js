/* ============================================
   Hooked With Love — Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // Header scroll effect
    // ==========================================
    var header = document.getElementById('siteHeader');

    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ==========================================
    // Mobile menu toggle
    // ==========================================
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function () {
            mainNav.classList.toggle('open');
            mobileMenuBtn.classList.toggle('active');
        });

        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ==========================================
    // Modal functionality (SKU-based enquiry)
    // ==========================================
    var modal = document.getElementById('contactModal');
    var modalClose = document.getElementById('modalClose');
    var whatsappLink = document.getElementById('whatsappLink');
    var modalProductPreview = document.getElementById('modalProductPreview');
    var modalProductImage = document.getElementById('modalProductImage');
    var modalProductName = document.getElementById('modalProductName');
    var modalTitle = document.getElementById('modalTitle');

    function openModal(productName, sku, imageSrc) {
        if (!modal) return;

        if (productName && sku && modalProductPreview) {
            modalProductPreview.style.display = 'block';
            if (modalProductImage) {
                modalProductImage.src = imageSrc || '';
                modalProductImage.alt = productName;
            }
            if (modalProductName) {
                modalProductName.textContent = productName + ' (' + sku + ')';
            }
            if (modalTitle) {
                modalTitle.textContent = 'Purchase Enquiry';
            }

            // WhatsApp link uses SKU instead of price
            if (whatsappLink) {
                var message = 'Hello Hooked With Love, I am interested in item ' + sku + ' (' + productName + '). Please share availability and pricing.';
                whatsappLink.href = 'https://wa.me/919985507347?text=' + encodeURIComponent(message);
            }
        } else {
            // General contact modal
            if (modalProductPreview) {
                modalProductPreview.style.display = 'none';
            }
            if (modalTitle) {
                modalTitle.textContent = 'Get in Touch';
            }
            if (whatsappLink) {
                whatsappLink.href = 'https://wa.me/919985507347?text=' + encodeURIComponent('Hello Hooked With Love, I am interested in your crochet creations!');
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            closeLightbox();
        }
    });

    // Open contact modal buttons (general contact)
    document.querySelectorAll('[data-open-contact]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    // Purchase enquiry buttons (product-specific with SKU)
    document.querySelectorAll('.btn-enquiry').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var productName = this.getAttribute('data-product');
            var sku = this.getAttribute('data-sku');
            var imageSrc = this.getAttribute('data-image');
            openModal(productName, sku, imageSrc);
        });
    });

    // ==========================================
    // Lightbox functionality
    // ==========================================
    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(imgSrc, caption) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = imgSrc;
        if (lightboxCaption) {
            lightboxCaption.textContent = caption || '';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Click on gallery card images to open lightbox
    document.querySelectorAll('.gallery-card-image').forEach(function (cardImage) {
        var img = cardImage.querySelector('img');
        if (!img) return;

        cardImage.style.cursor = 'pointer';
        cardImage.addEventListener('click', function () {
            var card = cardImage.closest('.gallery-card');
            var sku = card ? card.getAttribute('data-sku') : '';
            var name = card ? card.querySelector('h3') : null;
            var caption = '';
            if (name && sku) {
                caption = name.textContent + ' — ' + sku;
            } else if (name) {
                caption = name.textContent;
            }
            openLightbox(img.src, caption);
        });
    });

    // ==========================================
    // Gallery filtering
    // ==========================================
    var filterTabs = document.querySelectorAll('.filter-tab');
    var galleryCards = document.querySelectorAll('.gallery-card');
    var breadcrumbCategorySep = document.querySelector('.breadcrumb-category-sep');
    var breadcrumbCategory = document.querySelector('.breadcrumb-category');

    var categoryNames = {
        'all': 'All',
        'new-collection': 'New Collection',
        'flowers': 'Flowers',
        'fruits': 'Fruits',
        'hair-accessories': 'Hair Accessories',
        'lifestyle-accessories': 'Lifestyle Accessories'
    };

    function filterGallery(category) {
        filterTabs.forEach(function (tab) {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        var activeTab = document.querySelector('[data-category="' + category + '"]');
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }

        if (breadcrumbCategorySep && breadcrumbCategory) {
            if (category === 'all') {
                breadcrumbCategorySep.style.display = 'none';
                breadcrumbCategory.textContent = '';
            } else {
                breadcrumbCategorySep.style.display = '';
                breadcrumbCategory.textContent = categoryNames[category] || category;
            }
        }

        galleryCards.forEach(function (card) {
            card.classList.add('fade-out');
            card.classList.remove('fade-in');
        });

        setTimeout(function () {
            galleryCards.forEach(function (card) {
                var cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('fade-out');
                    card.classList.remove('fade-in');
                }
            });
        }, 200);
    }

    filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var category = this.getAttribute('data-category');
            filterGallery(category);
        });
    });

    // ==========================================
    // Back to Top button
    // ==========================================
    var backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // Lazy load animation (fade in on scroll)
    // ==========================================
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.gallery-card').forEach(function (card) {
            observer.observe(card);
        });
    }

    // ==========================================
    // Smooth scroll for anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
