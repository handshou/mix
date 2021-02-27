module.exports = {
  extends: ['react-app'],
  rules: {},
  overrides: [
    {
      files: ['**/*.js?(x)'],
      rules: {
        eqeqeq: 'off',
        'no-unused-vars': 'off',
        'no-redeclare': 'off',
        'no-loop-func': 'off',
        'no-redeclare': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
};
