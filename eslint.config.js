import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', '.vite'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // F1: o backend só é chamado por api.<domínio> (src/api).
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/api/**', 'src/lib/supabase.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='supabase'][property.name=/^(from|rpc|channel|functions|storage)$/]",
          message: 'Chame o backend por api.<domínio> (src/api), não pelo cliente Supabase direto.',
        },
      ],
    },
  },
);
