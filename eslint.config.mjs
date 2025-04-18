import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';

export default [
    jsdoc.configs['flat/recommended'],
    eslint.configs.recommended,
    {
        plugins: { jsdoc },
        languageOptions: {
            globals: { ...globals.browser },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'camelcase': ['warn'],
            'default-case-last': ['warn'],
            'default-case': ['warn'],
            'default-param-last': ['warn'],
            'dot-notation': ['warn'],
            'eqeqeq': ['warn', 'always'],
            'indent': ['warn', 4, { SwitchCase: 1 }],
            'linebreak-style': ['warn', 'unix'],
            'no-await-in-loop': ['warn'],
            'no-confusing-arrow': ['warn'],
            'no-console': ['warn'],
            'no-duplicate-imports': ['warn'],
            'no-empty-function': ['warn'],
            'no-eq-null': ['warn'],
            'no-eval': ['warn'],
            'no-floating-decimal': ['warn'],
            'no-implied-eval': ['warn'],
            'no-lone-blocks': ['warn'],
            'no-lonely-if': ['warn'],
            'no-multi-str': ['warn'],
            'no-new-func': ['warn'],
            'no-new-object': ['warn'],
            'no-new-wrappers': ['warn'],
            'no-return-await': ['warn'],
            'no-template-curly-in-string': ['warn'],
            'no-unneeded-ternary': ['warn'],
            'no-unreachable-loop': ['warn'],
            'no-unused-expressions': ['warn'],
            'no-useless-concat': ['warn'],
            'no-useless-rename': ['warn'],
            'no-var': ['warn'],
            'object-shorthand': ['warn', 'always'],
            'one-var-declaration-per-line': ['warn'],
            'prefer-arrow-callback': ['warn'],
            'prefer-const': ['warn'],
            'prefer-destructuring': ['warn', { array: false, object: true }, { enforceForRenamedProperties: false }],
            'quotes': ['warn', 'single', { avoidEscape: true }],
            'require-await': ['warn'],
            'semi': ['warn', 'always'],
            'yoda': ['warn', 'never'],
            'jsdoc/no-undefined-types': ['warn'],
            'jsdoc/require-returns-description': ['off'],
            'jsdoc/valid-types': ['off'],
        },
    },
];
