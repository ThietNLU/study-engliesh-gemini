# Code Quality Tools

This project uses ESLint + Prettier + Husky + lint-staged to ensure code quality and consistency.

## 🛠️ Available Scripts

```bash
# Linting
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting errors

# Formatting  
npm run format            # Format all code with Prettier
npm run format:check      # Check if code is properly formatted

# Development
npm start                 # Start development server
npm run build            # Build for production
```

## 🔧 Tools Configuration

### ESLint
- **File**: `.eslintrc.js`
- **Rules**: React, React Hooks, JSX a11y, Prettier integration
- **Auto-fix**: Runs on save and before commits

### Prettier
- **File**: `.prettierrc`
- **Settings**: 2 spaces, single quotes, trailing commas
- **Integration**: Works with ESLint, runs on save

### Husky + lint-staged
- **Pre-commit hook**: Auto-runs ESLint fix and Prettier on staged files
- **Configuration**: In `package.json` under `lint-staged`

### VS Code Settings
- **File**: `.vscode/settings.json`
- **Features**: Format on save, auto-fix on save, proper file associations

## 🚀 Git Workflow

When you commit code:
1. **Husky** triggers the pre-commit hook
2. **lint-staged** runs on staged files:
   - ESLint auto-fixes JavaScript/JSX files
   - Prettier formats all supported files
3. If everything passes, commit succeeds
4. If there are unfixable errors, commit is blocked

## 📝 Best Practices

1. **Write clean code** - ESLint will catch common issues
2. **Let tools format** - Don't manually format, let Prettier handle it
3. **Fix warnings** - Console statements are warnings in development, errors in production
4. **Use accessibility features** - a11y rules help make the app accessible

## 🔍 Common Issues

### Linting Errors
- **Unused variables**: Prefix with `_` or remove them
- **Console statements**: Use only for debugging, remove in production
- **Missing dependencies**: Add to React Hook dependency arrays

### Formatting Issues
- Prettier will auto-fix most formatting issues
- Use `npm run format` to format all files manually

### Git Hook Issues
- If pre-commit hook fails, fix the reported errors
- Use `npm run lint:fix` before committing
- Check `.husky/pre-commit` if hooks aren't working

## 📊 Current Status

✅ **ESLint**: Configured with React best practices  
✅ **Prettier**: Auto-formatting enabled  
✅ **Husky**: Git hooks working  
✅ **lint-staged**: Pre-commit auto-fixing  
✅ **VS Code**: Optimized settings  

**Current state**: 0 errors, 93 warnings (mostly console.log statements)
