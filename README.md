# babel-plugin-transform-jsx-css-modules

Transforms `className` attributes in JSX to get css-modules' references.

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-jsx-css-modules.svg?longCache)](https://www.npmjs.com/package/babel-plugin-transform-jsx-css-modules) [![CI Status](https://img.shields.io/circleci/project/github/ezhlobo/babel-plugin-transform-jsx-css-modules/master.svg?longCache)](https://circleci.com/gh/ezhlobo/babel-plugin-transform-jsx-css-modules/tree/master)

**Note:** It does not turn on CSS Modules in your project, it assumes that you made it yourself.

- [Example](#example)
- [Usage](#usage)
- [Options](#options)

## Example

```jsx
import './styles.css'

const Component = () => (
  <div styleName="root second-class">
    <h1 styleName="paragraph">Hello World!</h1>
    <p className="global" styleName="local">I'm glad to see <span className="just-global">you</span></p>
  </div>
)
```

Will be transpiled into

```jsx
import __cssmodule__ from './styles.css'

const Component = () => (
  <div className={[__cssmodule__['root'], __cssmodule__['second-class']]}>
    <h1 className={__cssmodule__['paragraph']}>Hello World!</h1>
    <p className={['global', __cssmodule__['local']]}>I'm glad to see <span className="just-global">you</span></p>
  </div>
)
```

## Usage

1. Install plugin

   ```shell
   npm install --save-dev babel-plugin-transform-jsx-css-modules
   ```
   
2. Add plugin to your `.babelrc` file

   ```json
   {
     "plugins": [
       "transform-jsx-css-modules"
     ]
   }
   ```

## Options

- **`sourceAttribute`** (default: `styleName`)

   What attribute should be transformed with CSS Modules references.
   
   Set to `className` to transform `<div className="hey" />` into `<div className={__cssmodules__['hey']} />`.
   
- **`targetAttribute`** (default: `className`)
   
   After converting references will be added to this attribute.
   
   Set to `cssmodule` to transform `<div styleName="hey" />` into `<div cssmodule={__cssmodules__['hey']} />`.
   
How to turn on options: [babeljs.io/docs/plugins](http://babeljs.io/docs/plugins/#pluginpreset-options). For example in `.babelrc`:

```json
{
  "plugins": [
    ["transform-jsx-css-modules", {
      "option": "value",
    }]
  ]
}
```
