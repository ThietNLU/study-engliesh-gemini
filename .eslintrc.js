module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier', // Phải để cuối để override các rules conflict
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    // Prettier rules
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    
    // React rules
    'react/react-in-jsx-scope': 'off', // Không cần import React trong React 17+
    'react/prop-types': 'off', // Tắt prop-types validation
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/no-unescaped-entities': 'off', // Cho phép dấu ngoặc kép trong JSX
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General rules
    'no-console': 'off', // Temporarily disable for build
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^(React|_)', // Ignore React imports and variables starting with _
    }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // JSX a11y rules (accessibility) - make them warnings instead of errors
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'build/',
    'dist/',
    'node_modules/',
    '*.min.js',
  ],
};
