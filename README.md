# babel-plugin-transform-jsx-css-modules

Transforms `className` attributes in JSX to get css-modules' references.

**Note:** It does not turn on CSS Modules in your project, it assumes that you made it yourself.

- [Example](#example)
- [Usage](#usage)

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
