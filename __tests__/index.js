const pluginTester = require('babel-plugin-tester')
const plugin = require('../index.js')

pluginTester({
  plugin,
  title: 'default config',
  tests: [
    {
      title: 'does not change files without styles',
      code: '<div className="global" styleName="local"></div>;',
    },

    {
      title: 'amends class names if styles import is provided',
      snapshot: true,
      code: `
        import './styles.css';

        <div test="test" styleName="local"></div>;
        <div test="test" styleName="local-one local-two"></div>;
      `,
    },

    {
      title: 'does not change import if styles is imported already',
      snapshot: true,
      code: `
        import __CSSM__ from './styles.css';

        <div styleName="local"></div>;
        <div styleName="local-one local-two"></div>;
      `,
    },

    {
      title: 'combines global and local styles',
      snapshot: true,
      code: `
        import __CSSM__ from './styles.css';

        <div className="global" styleName="local"></div>;
      `,
    },

    {
      title: 'leaves plain literal for global class',
      snapshot: true,
      code: `
        import './styles.css';

        <div className="global"></div>;
      `,
    },

    {
      title: 'leaves plain literals for global classes',
      snapshot: true,
      code: `
        import './styles.css';

        <div className="global-one global-two"></div>;
      `,
    },

    {
      title: 'concats classes when globals are computed',
      snapshot: true,
      code: `
        import './styles.css';

        <div className={[test, 'string'].join(' ')} styleName="local"></div>;
      `,
    },

    {
      title: 'concats classes when locals are computed',
      snapshot: true,
      code: `
        import './styles.css';

        <div className={test} styleName={"local-" + index}></div>;
      `,
    },
  ],
})
