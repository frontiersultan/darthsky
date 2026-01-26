# Contributing to Darth Sky Weather

Thank you for your interest in contributing to Darth Sky Weather! This document provides guidelines and information for contributors.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/darthsky.git
   cd darthsky
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:9050`

### Running Tests

```bash
npm run test        # Watch mode
npm run test -- --run  # Single run
```

### Code Style

- We use TypeScript for type safety
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add precipitation intensity legend`
- `fix: correct temperature unit conversion`
- `docs: update API documentation`
- `test: add tests for weather code mapping`
- `refactor: simplify location store logic`

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features
3. **Run tests** to ensure nothing is broken
4. **Update the README** if needed
5. **Submit your PR** with a clear description of changes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes

## Reporting Issues

### Bug Reports

When reporting bugs, please include:
- Browser and version
- Device type (mobile/desktop)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests

For feature requests, please describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Project Structure

See the [README](README.md) for project structure documentation.

## Questions?

Feel free to open an issue for any questions about contributing.
