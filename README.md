# babel-plugin-transform-jsx-css-modules

Transforms `className` attributes in JSX to get css-modules' references.

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-jsx-css-modules.svg?longCache)](https://www.npmjs.com/package/babel-plugin-transform-jsx-css-modules) [![CI Status](https://img.shields.io/circleci/project/github/ezhlobo/babel-plugin-transform-jsx-css-modules/master.svg?longCache)](https://circleci.com/gh/ezhlobo/babel-plugin-transform-jsx-css-modules/tree/master)

**Note:** It does not turn on CSS Modules in your project, it assumes that you made it yourself (via webpack and css-loader for example).

- [Example](#example)
- [Usage](#usage)
- [Options](#options)

## Example

```jsx
import './styles.css'

const Component = () => (
  <div styleName="root">
    <h1 className="paragraph">Hello World</h1>
    <p className="global" styleName="local">I'm an example!</p>
  </div>
)
```

Will be transpiled into

```jsx
import __CSSM__ from './styles.css'

const Component = () => (
  <div className={__CSSM__['root']}>
    <h1 className="paragraph">Hello World</h1>
    <p className={["global", __CSSM__["local"]].join(" ")}>I'm an example!</p>
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

| Name | Type | Default | Description
| - | - | - | -
| [`pathToStyles`](#pathtostyles) | `RegExp` | `/^\.\/styles\.css$/` | It specifies what imports should be transformed

### `pathToStyles`

If you set it to `/^\.\/module\.scss$/` it will handle imports which start and end with `./module.scss`:

```jsx
import './module.scss'
```

Will be transformed into:

```jsx
import __CSSM__ from './module.scss'
```
