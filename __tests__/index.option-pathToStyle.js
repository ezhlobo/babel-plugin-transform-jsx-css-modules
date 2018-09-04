const pluginTester = require('babel-plugin-tester')
const plugin = require('../index.js')

pluginTester({
  plugin,
  pluginOptions: {
    pathToStyles: /^\.\/module.scss$/,
  },
  title: 'with options: "pathToStyles"',
  tests: [
    {
      title: 'does nothing with default import',
      code: `
        import './styles.css';

        <div className="global"></div>;
      `,
    },

    {
      title: 'amends class names if styles import is provided',
      snapshot: true,
      code: `
        import './module.scss';

        <div className="global-one global-two" styleName="local-one local-two"></div>;
      `,
    },
  ],
})
