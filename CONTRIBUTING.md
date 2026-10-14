# Contributing Guidelines

Thank you for contributing to **Haji Nuts & Spices**! To maintain enterprise quality and ensure security across production deployments, please follow these guidelines.

---

## 1. Branching Strategy

- `main` / `master`: Production-ready code. Direct pushes are protected; all changes must merge via tested pull requests.
- `feature/<feature-name>`: New feature implementations.
- `fix/<bug-description>`: Bug fixes and security patches.

---

## 2. Commit Message Standards

We follow Conventional Commits formatting:

```
<type>(<scope>): <short description>

[optional body]
```

**Allowed Types:**
- `feat`: A new user-facing feature
- `fix`: A bug fix or security patch
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance or bundle size
- `test`: Adding or correcting tests
- `docs`: Documentation updates
- `chore`: Dependency updates, build configuration

**Examples:**
- `feat(orders): add guest phone4 verification on order lookup`
- `fix(payments): require raw buffer for Cashfree webhook HMAC verification`
- `perf(catalog): replace inline base64 images with optimized CDN URLs`

---

## 3. Pull Request Checklist

Before submitting a PR, verify the following locally:

1. **Linting**:
   ```bash
   npm run lint
   ```
   Must pass with **0 errors**.

2. **Frontend Tests & Build**:
   ```bash
   npm test
   npm run build
   ```
   All tests must pass and the Vite bundle must compile cleanly.

3. **Backend Tests & Coverage**:
   ```bash
   cd server
   npm test -- --coverage
   ```
   All 35+ integration tests must pass.

4. **Security & Parameterization**:
   - Ensure all database queries use parameterized SQL (`?` placeholders).
   - Never print or commit real credentials or secret keys.
   - Any new environment variable must be added to `.env.example`.
