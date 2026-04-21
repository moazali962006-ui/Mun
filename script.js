const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : '';
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            navLinks.classList.remove('active');
        }
    });
});

function updateCountdown() {
    const targetDate = new Date('2026-04-22T00:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days < 10 ? '0' + days : days;
    document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

    if (difference < 0) {
        document.getElementById('countdown').innerHTML = '<h2>MUN Conference is Here!</h2>';
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

function slideDelegates(committeeId, direction) {
    const grid = document.getElementById(committeeId + '-track');
    if (!grid) return;

    const firstCard = grid.querySelector('.delegate-card');
    if (!firstCard) return;

    const isMobile = window.innerWidth <= 480;

    const cardWidth = firstCard.offsetWidth;
    const computedStyle = window.getComputedStyle(grid);
    const cardGap = parseFloat(computedStyle.gap) || 24;
    const visibleCards = isMobile ? 1 : Math.floor(grid.offsetWidth / (cardWidth + cardGap)) || 1;
    const scrollAmount = (cardWidth + cardGap) * visibleCards;

    const currentScroll = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.offsetWidth;
    let targetScroll = currentScroll + (direction * scrollAmount);

    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    grid.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const grids = document.querySelectorAll('.delegates-grid');

    grids.forEach(grid => {
        let isDown = false;
        let startX;
        let scrollLeft;

        grid.addEventListener('mousedown', (e) => {
            isDown = true;
            grid.style.cursor = 'grabbing';
            startX = e.pageX - grid.offsetLeft;
            scrollLeft = grid.scrollLeft;
        });

        grid.addEventListener('mouseleave', () => {
            isDown = false;
            grid.style.cursor = 'grab';
        });

        grid.addEventListener('mouseup', () => {
            isDown = false;
            grid.style.cursor = 'grab';
        });

        grid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - grid.offsetLeft;
            const walk = (x - startX) * 2;
            grid.scrollLeft = scrollLeft - walk;
        });

        let touchStartX = 0;
        let touchEndX = 0;

        grid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        grid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(grid, touchStartX, touchEndX);
        }, { passive: true });

        function handleSwipe(element, start, end) {
            const threshold = 50;
            const diff = start - end;

            if (Math.abs(diff) > threshold) {
                const isMobile = window.innerWidth <= 480;

                const cardWidth = element.querySelector('.delegate-card')?.offsetWidth || 250;
                const computedStyle = window.getComputedStyle(element);
                const cardGap = parseFloat(computedStyle.gap) || 24;
                const visibleCards = isMobile ? 1 : Math.floor(element.offsetWidth / (cardWidth + cardGap)) || 1;
                const scrollAmount = (cardWidth + cardGap) * visibleCards;

                const currentScroll = element.scrollLeft;
                const maxScroll = element.scrollWidth - element.offsetWidth;
                let targetScroll = currentScroll + (diff > 0 ? scrollAmount : -scrollAmount);

                targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

                element.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }
        }

        grid.style.cursor = 'grab';
    });

    window.addEventListener('resize', debounce(function() {
        grids.forEach(grid => {
            const container = grid.closest('.slider-container');
            if (container) {
                const firstCard = grid.querySelector('.delegate-card');
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const computedStyle = window.getComputedStyle(grid);
                    const cardGap = parseFloat(computedStyle.gap) || 24;
                    const isMobile = window.innerWidth <= 480;
                    const visibleCards = isMobile ? 1 : Math.floor(grid.offsetWidth / (cardWidth + cardGap));

                    if (visibleCards >= grid.children.length) {
                        const prevBtn = container.querySelector('.prev-btn');
                        const nextBtn = container.querySelector('.next-btn');
                        if (prevBtn) prevBtn.style.display = 'none';
                        if (nextBtn) nextBtn.style.display = 'none';
                    } else {
                        const prevBtn = container.querySelector('.prev-btn');
                        const nextBtn = container.querySelector('.next-btn');
                        if (prevBtn) prevBtn.style.display = 'flex';
                        if (nextBtn) nextBtn.style.display = 'flex';
                    }
                }
            }
        });
    }, 250));
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('keydown', function(e) {
    const sections = {
        '1': '#home',
        '2': '#about',
        '3': '.diplomatic-toolkit',
        '4': '.about-gallery',
        '5': '#schedule',
        '6': '#committees',
        '7': '#delegates',
        '8': '#hierarchy'
    };

    if (sections[e.key]) {
        e.preventDefault();
        const target = document.querySelector(sections[e.key]);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});