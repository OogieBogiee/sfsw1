(function ($) {
    "use strict";

    new WOW().init();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) $('.navbar').addClass('sticky-top shadow-sm');
        else $('.navbar').removeClass('sticky-top shadow-sm');

        if ($(this).scrollTop() > 300) $('.back-to-top').fadeIn('slow');
        else $('.back-to-top').fadeOut('slow');

        const idioma = $('.idioma-simple');
        if ($(this).scrollTop() > 0) idioma.addClass('scroll-down');
        else idioma.removeClass('scroll-down');

        if ($(this).scrollTop() > 300) $('.chatgpt-btn').fadeIn('slow');
        else $('.chatgpt-btn').fadeOut('slow');
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 200, 'easeInOutExpo');
        return false;
    });

    document.addEventListener('DOMContentLoaded', function () {
        const menuLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
        const sections = Array.from(menuLinks)
            .map(link => document.getElementById(link.getAttribute('href').slice(1)))
            .filter(sec => sec);

        function clearActive() {
            menuLinks.forEach(l => l.classList.remove('active'));
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                clearActive();
                link.classList.add('active');
                if (link.classList.contains('dropdown-item')) 
                    link.closest('.dropdown-menu').previousElementSibling.classList.add('active');

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                clearActive();
                menuLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                        if (link.classList.contains('dropdown-item')) 
                            link.closest('.dropdown-menu').previousElementSibling.classList.add('active');
                    }
                });
            });
        }, { root: null, rootMargin: '0px', threshold: 0.5 });

        sections.forEach(sec => observer.observe(sec));
    });
})(jQuery);

let scrollPos = 0;

document.querySelectorAll('.btn-show-bio').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollPos = window.scrollY;
        const overlay = document.getElementById(btn.getAttribute('data-target'));
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        $(document.querySelector('.back-to-top')).fadeOut('fast');
        overlay.scrollTop = 0;
    });
});

document.querySelectorAll('.btn-close-bio').forEach(btn => {
    btn.addEventListener('click', () => {
        const overlay = btn.closest('.bio-overlay');
        overlay.style.transform = 'translateY(50px) scale(0.9)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.transform = '';
            overlay.style.opacity = '';
        }, 400);
        document.body.classList.remove('no-scroll');
        $(document.querySelector('.back-to-top')).fadeIn('fast');
        window.scrollTo(0, scrollPos);
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.multimedia-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) card.classList.remove('hidden');
            else card.classList.add('hidden');
        });
    });
});
document.querySelectorAll('.btn-show-bio').forEach(btn => {
    btn.addEventListener('click', function(){
        const target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        document.body.classList.add('no-scroll');
    });
});

document.querySelectorAll('.btn-close-bio').forEach(btn => {
    btn.addEventListener('click', function(){
        this.closest('.bio-overlay').classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

document.querySelectorAll('.btn-share').forEach(btn => {
    btn.addEventListener('click', function(e){
        e.stopPropagation();
        const container = this.closest('.binomio-img');
        container.classList.toggle('active');
    });
});

document.addEventListener('click', function(e){
    document.querySelectorAll('.binomio-img.active').forEach(el => {
        if(!el.contains(e.target)){
            el.classList.remove('active');
        }
    });
});
