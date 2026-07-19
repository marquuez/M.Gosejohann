/**
 * Made-by-Hinweis: dunkle Schrift auf hellem Grund, weiße Schrift auf dunklem Grund.
 * Prüft per elementFromPoint, welche Fläche hinter dem Credit liegt.
 */
(function () {
    const credit = document.querySelector('.site-credit');
    if (!credit) return;

    const DARK_SELECTOR = '.hero, .hero-stage, .features, .footer, [data-credit-contrast="dark"]';

    function updateContrast() {
        const rect = credit.getBoundingClientRect();
        const x = Math.min(window.innerWidth - 1, Math.max(0, rect.left + rect.width / 2));
        const y = Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height / 2));

        credit.style.visibility = 'hidden';
        const under = document.elementFromPoint(x, y);
        credit.style.visibility = '';

        const onDark = Boolean(under && under.closest(DARK_SELECTOR));
        credit.classList.toggle('site-credit--on-dark', onDark);
        credit.classList.toggle('site-credit--on-light', !onDark);
    }

    let ticking = false;
    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            updateContrast();
        });
    }

    updateContrast();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
})();
