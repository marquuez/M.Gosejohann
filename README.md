# Gosejohann GmbH - Website

Moderne, responsive Website für Gosejohann GmbH - Fahrzeug- & Karosseriebau.

## Features

- 🎨 Modernes, zeitgemäßes Design (2026)
- 📱 Vollständig responsive für alle Geräte
- ✨ Smooth Scroll Animationen
- 🚀 Performance-optimiert
- ♿ Accessibility-freundlich
- 🎯 Einfache Navigation
- 📧 Kontaktformular
- 🌐 SEO-optimiert

## Technologien

- HTML5
- CSS3 (mit modernen Features wie CSS Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (keine Dependencies)
- Google Fonts (Inter)

## Installation

1. Dependencies installieren:
```bash
npm install
```

2. Development Server starten:
```bash
npm run dev
```

Die Website läuft dann auf `http://localhost:5173` (oder einem anderen Port, den Vite anzeigt)

3. Für Production Build:
```bash
npm run build
```

4. Preview des Production Builds:
```bash
npm run preview
```

### Alternative (ohne npm):

Einfach `index.html` in einem modernen Browser öffnen oder einen lokalen Server verwenden:

```bash
# Mit Python
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server

# Mit PHP
php -S localhost:8000
```

## Dateistruktur

```
gosejohann/
├── index.html      # Haupt-HTML-Datei
├── styles.css      # Alle Styles und Animationen
├── script.js       # JavaScript für Interaktivität
└── README.md       # Diese Datei
```

## Browser-Unterstützung

- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## Anpassungen

### Farben ändern

In `styles.css` die CSS-Variablen anpassen:

```css
:root {
    --primary-color: #1a1a1a;
    --accent-color: #ff6b35;
    /* ... */
}
```

### Inhalte ändern

Alle Inhalte können direkt in `index.html` bearbeitet werden.

### Animationen anpassen

Animationen können in `styles.css` und `script.js` angepasst werden.

## Kontaktformular

Das Kontaktformular ist aktuell für Frontend-Demo konfiguriert. Für Produktionseinsatz:

1. Backend-Endpoint einrichten
2. Formular-Submission in `script.js` anpassen
3. Validierung erweitern

## Performance

- Optimierte Bilder (wenn hinzugefügt)
- Lazy Loading für Animationen
- Debounced Scroll Events
- Minimale Dependencies

## Lizenz

© 2026 Gosejohann GmbH. Alle Rechte vorbehalten.

