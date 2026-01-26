# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Darth Sky Weather, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Send a detailed report to the project maintainers via GitHub's private vulnerability reporting feature
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- Acknowledgment within 48 hours
- Regular updates on the status
- Credit in the fix announcement (unless you prefer anonymity)

## Security Considerations

### Client-Side Application

Darth Sky Weather is a client-side Progressive Web App. All data processing happens in the user's browser.

### API Usage

The app uses public, free APIs that do not require authentication:
- Open-Meteo (weather data)
- RainViewer (radar data)
- Nominatim (geocoding)
- CartoDB (map tiles)

### Data Storage

- Location data is stored locally in the browser (localStorage)
- No personal data is transmitted to external servers beyond the APIs listed above
- No analytics or tracking is implemented

### Permissions

The app may request:
- **Geolocation**: To detect current location (optional, user-initiated)
