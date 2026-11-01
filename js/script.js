document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Countdown Script
    (function() {
        const targetDate = new Date('2026-12-20T11:00:00+05:30').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
                document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
                document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
                document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
            } else {
                document.getElementById('cd-days').textContent = '00';
                document.getElementById('cd-hours').textContent = '00';
                document.getElementById('cd-minutes').textContent = '00';
                document.getElementById('cd-seconds').textContent = '00';
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    })();

    // 2. Mobile Menu Toggle Script
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('hidden');
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });
    }

    // 3. Smart Dynamic Gallery Script
    const track = document.getElementById('slides-track');
    const galleryContainer = document.getElementById('gallery-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    let currentIndex = 0;
    let loadedSlides = [];
    let checksCompleted = 0;
    const totalImagesToCheck = 10;

    for (let i = 1; i <= totalImagesToCheck; i++) {
        const imgPath = `images/gallery-${i}.jpg`;
        const img = new Image();
        img.src = imgPath;
        
        img.onload = function() {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'gallery-slide';
            
            const slideImg = document.createElement('img');
            slideImg.src = imgPath;
            slideImg.alt = `Gallery Photo ${i}`;
            
            slideDiv.appendChild(slideImg);
            loadedSlides.push({ index: i, element: slideDiv });
            finalizeGallery();
        };

        img.onerror = function() {
            finalizeGallery();
        };
    }

    function finalizeGallery() {
        checksCompleted++;
        if (checksCompleted === totalImagesToCheck) {
            if (loadedSlides.length > 0) {
                loadedSlides.sort((a, b) => a.index - b.index);
                loadedSlides.forEach(slide => track.appendChild(slide.element));
                galleryContainer.classList.remove('hidden');

                if (loadedSlides.length > 1) {
                    const updateButtons = () => {
                        prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
                        nextBtn.style.display = currentIndex === loadedSlides.length - 1 ? 'none' : 'block';
                    };

                    const updateSlidePosition = () => {
                        track.style.transform = `translateX(-${currentIndex * 100}%)`;
                        updateButtons();
                    };

                    updateButtons();

                    nextBtn.addEventListener('click', () => {
                        if (currentIndex < loadedSlides.length - 1) {
                            currentIndex++;
                            updateSlidePosition();
                        }
                    });

                    prevBtn.addEventListener('click', () => {
                        if (currentIndex > 0) {
                            currentIndex--;
                            updateSlidePosition();
                        }
                    });

                    let touchStartX = 0;
                    let touchEndX = 0;

                    track.addEventListener('touchstart', e => {
                        touchStartX = e.changedTouches[0].screenX;
                    });

                    track.addEventListener('touchend', e => {
                        touchEndX = e.changedTouches[0].screenX;
                        if (touchStartX - touchEndX > 50) {
                            if (currentIndex < loadedSlides.length - 1) {
                                currentIndex++;
                                updateSlidePosition();
                            }
                        } else if (touchEndX - touchStartX > 50) {
                            if (currentIndex > 0) {
                                currentIndex--;
                                updateSlidePosition();
                            }
                        }
                    });
                } else {
                    nextBtn.style.display = 'none';
                    prevBtn.style.display = 'none';
                }
            } else {
                galleryContainer.classList.add('hidden');
            }
        }
    }

    // 4. Fold-and-Fly Letter Animation Handler
    const wishesForm = document.getElementById('wishes-form');
    const letterCard = document.getElementById('letter-card');
    const letterSuccess = document.getElementById('letter-success');

    if (wishesForm) {
        wishesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            letterCard.classList.add('fold-and-fly');

            const formData = new FormData(wishesForm);
            fetch(wishesForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                setTimeout(() => {
                    wishesForm.classList.add('hidden');
                    letterCard.classList.remove('fold-and-fly');
                    letterCard.style.transform = 'none';
                    letterSuccess.classList.remove('hidden');
                }, 1400);
            }).catch(error => {
                wishesForm.submit();
            });
        });
    }
});