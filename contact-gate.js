/**
 * Spam-Schutz für Anbieterdaten.
 * Nach korrekter Code-Eingabe: Challenge-UI verschwindet vollständig,
 * nur die Kontaktdaten bleiben sichtbar. Beim Neuladen der Seite
 * ist der Schutz wieder aktiv (kein Persistieren).
 */
(function () {
    const GATES = document.querySelectorAll('[data-contact-gate]');
    if (!GATES.length) return;

    const ENCODED =
        'eyJjb21wYW55IjoiRmFocnpldWdiYXUgTS4gR29zZWpvaGFubiBHbWJIIiwic3RyZWV0IjoiSW5kdXN0cmllc3RyYcOfZSAyMiIsInppcCI6IjMzMzk3IiwiY2l0eSI6IlJpZXRiZXJnIiwiY291bnRyeSI6IkRldXRzY2hsYW5kIiwicGhvbmUiOiIrNDkgKDApIDUyIDQ0IC8gNyA3OCAxOCIsInBob25lVGVsIjoiKzQ5NTI0NDc3ODE4IiwibW9iaWxlIjoiKzQ5ICgwKSAxNyAxIC8gOCA1MSA0OSA2MyIsIm1vYmlsZVRlbCI6Iis0OTE3MTg1MTQ5NjMiLCJmYXgiOiIrNDkgKDApIDUyIDQ0IC8gNyA4NSAyOSIsImVtYWlsIjoiaW5mb0BmYWhyemV1Z2JhdS1tLWdvc2Vqb2hhbm4uY29tIiwiZGlyZWN0b3IiOiJNYXR0aGlhcyBHb3Nlam9oYW5uIiwiYWdlbmN5Ijp7Im5hbWUiOiJJVE1FLVNvbHV0aW9ucywgSW5oLiBNYXJjIFNjaHVsZW5iZXJnIiwiY2l0eSI6IlJpZXRiZXJnIiwiY291bnRyeSI6IkRldXRzY2hsYW5kIiwicGhvbmUiOiIrNDkgKDApIDUyIDQ0IC8gOTYwIDk5IDkyIiwicGhvbmVUZWwiOiIrNDk1MjQ0OTYwOTk5MiIsImVtYWlsIjoiaW5mb0BpdG1lLXNvbHV0aW9ucy5kZSIsIndlYiI6Imh0dHBzOi8vaXRtZS1zb2x1dGlvbnMuZGUiLCJ3ZWJMYWJlbCI6Iml0bWUtc29sdXRpb25zLmRlIn19';

    function decodePayload() {
        const binary = atob(ENCODED);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    }

    function randomCode() {
        return String(Math.floor(1000 + Math.random() * 9000));
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function buildRevealedHtml(data, variant) {
        if (variant === 'datenschutz') {
            return `
                <p>
                    <strong>${escapeHtml(data.company)}</strong><br>
                    ${escapeHtml(data.street)}<br>
                    ${escapeHtml(data.zip)} ${escapeHtml(data.city)}<br>
                    ${escapeHtml(data.country)}
                </p>
                <p>
                    Telefon: <a href="tel:${escapeHtml(data.phoneTel)}">${escapeHtml(data.phone)}</a><br>
                    Mobil: <a href="tel:${escapeHtml(data.mobileTel)}">${escapeHtml(data.mobile)}</a><br>
                    Fax: ${escapeHtml(data.fax)}<br>
                    E-Mail: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
                </p>
                <p>Vertreten durch den Geschäftsführer ${escapeHtml(data.director)}.</p>
            `;
        }

        if (variant === 'impressum-full') {
            return `
                <h2>Anbieter</h2>
                <p>
                    <strong>${escapeHtml(data.company)}</strong><br>
                    ${escapeHtml(data.street)}<br>
                    ${escapeHtml(data.zip)} ${escapeHtml(data.city)}<br>
                    ${escapeHtml(data.country)}
                </p>
                <h2>Vertreten durch</h2>
                <p>Geschäftsführer: ${escapeHtml(data.director)}</p>
                <h2>Kontakt</h2>
                <p>
                    Telefon: <a href="tel:${escapeHtml(data.phoneTel)}">${escapeHtml(data.phone)}</a><br>
                    Mobil: <a href="tel:${escapeHtml(data.mobileTel)}">${escapeHtml(data.mobile)}</a><br>
                    Fax: ${escapeHtml(data.fax)}<br>
                    E-Mail: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
                </p>
            `;
        }

        if (variant === 'impressum-responsible') {
            return `
                <p>
                    ${escapeHtml(data.director)}<br>
                    ${escapeHtml(data.street)}<br>
                    ${escapeHtml(data.zip)} ${escapeHtml(data.city)}
                </p>
            `;
        }

        if (variant === 'impressum-agency') {
            const agency = data.agency || {};
            return `
                <p>
                    <strong>${escapeHtml(agency.name)}</strong><br>
                    ${escapeHtml(agency.city)}, ${escapeHtml(agency.country)}
                </p>
                <p>
                    Telefon: <a href="tel:${escapeHtml(agency.phoneTel)}">${escapeHtml(agency.phone)}</a><br>
                    E-Mail: <a href="mailto:${escapeHtml(agency.email)}">${escapeHtml(agency.email)}</a><br>
                    Internet: <a href="${escapeHtml(agency.web)}" target="_blank" rel="noopener noreferrer">${escapeHtml(agency.webLabel)}</a>
                </p>
            `;
        }

        return `
            <p>
                <strong>${escapeHtml(data.company)}</strong><br>
                ${escapeHtml(data.street)}<br>
                ${escapeHtml(data.zip)} ${escapeHtml(data.city)}<br>
                ${escapeHtml(data.country)}
            </p>
        `;
    }

    function revealGate(el, data) {
        const variant = el.getAttribute('data-contact-gate') || 'default';
        el.classList.add('contact-gate-host--unlocked');
        el.innerHTML = `<div class="contact-gate-revealed">${buildRevealedHtml(data, variant)}</div>`;
    }

    function revealAllGates(data) {
        GATES.forEach((el) => revealGate(el, data));
    }

    function mountChallenge(el, index, data) {
        const inputId = `contactGateInput-${index}`;
        let code = randomCode();

        el.classList.remove('contact-gate-host--unlocked');
        el.innerHTML = `
            <div class="contact-gate" role="group" aria-label="Geschützte Anbieterkennzeichnung">
                <p class="contact-gate__title">Anbieterkennzeichnung (geschützt)</p>
                <p class="contact-gate__hint">
                    Geben Sie die angezeigte Zahl ein, um Adresse, Telefon und E-Mail anzuzeigen.
                </p>
                <form class="contact-gate__form">
                    <label class="contact-gate__label" for="${inputId}">
                        Sicherheitscode: <strong class="contact-gate__code" aria-live="polite">${code}</strong>
                    </label>
                    <div class="contact-gate__row">
                        <input
                            class="contact-gate__input"
                            id="${inputId}"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            autocomplete="off"
                            maxlength="4"
                            required
                            aria-label="Sicherheitscode eingeben"
                        >
                        <button type="submit" class="btn btn-primary">Anzeigen</button>
                    </div>
                    <p class="contact-gate__error" hidden>Die Zahl ist nicht korrekt. Bitte erneut versuchen.</p>
                </form>
            </div>
        `;

        const form = el.querySelector('.contact-gate__form');
        const input = el.querySelector('.contact-gate__input');
        const error = el.querySelector('.contact-gate__error');
        const codeEl = el.querySelector('.contact-gate__code');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (input.value.trim() !== code) {
                error.hidden = false;
                code = randomCode();
                codeEl.textContent = code;
                input.value = '';
                input.focus();
                return;
            }

            revealAllGates(data);
        });
    }

    let data;
    try {
        data = decodePayload();
    } catch {
        GATES.forEach((el) => {
            el.innerHTML = '<p class="contact-gate__error">Kontaktdaten konnten nicht geladen werden.</p>';
        });
        return;
    }

    GATES.forEach((el, index) => {
        if (index === 0) {
            mountChallenge(el, index, data);
        } else {
            el.innerHTML = `
                <div class="contact-gate contact-gate--pending">
                    <p class="contact-gate__hint">
                        Bitte zuerst die Anbieterkennzeichnung oben freischalten.
                    </p>
                </div>
            `;
        }
    });
})();
