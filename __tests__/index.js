const pluginTester = require('babel-plugin-tester')
const plugin = require('../index.js')

pluginTester({
  plugin,
  tests: [
    {
      title: 'does not change files without styles',
      code: '<div className="hello"></div>;',
    },

    {
      title: 'amends class names if styles import is provided',
      snapshot: true,
      code: `
        import './styles.css';

        <div className="hello"></div>;
      `,
    },

    {
      title: 'does not change import if styles is imported already',
      snapshot: true,
      code: `
        import __cssmodule__ from './styles.css';

        <div className="hello"></div>;
      `,
    },
  ],
})
