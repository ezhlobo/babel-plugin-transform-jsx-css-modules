const jsxSyntax = require('babel-plugin-syntax-jsx')

const REFERENCE = '__CSSM__'
const SOURCE_ATTR_NAME = 'styleName'
const TARGET_ATTR_NAME = 'className'

const getPathChecker = state =>
  state.opts.pathToStyles || /^\.\/styles.css$/

const isCssModuleImport = (node, state) => {
  const pathChecker = getPathChecker(state)

  return node.specifiers.length === 0 && pathChecker.test(node.source.value)
}

const setState = (state, key, value) => state.file.set(key, value)
const getState = (state, key) => state.file.get(key)

const setClasses = (state, value) => setState(state, 'classes', value)
const getClasses = state => getState(state, 'classes')

const hasImportDecl = (path, state) => (
  getState(state, 'hasCssModuleImport') || path.scope.hasBinding(REFERENCE)
)

module.exports = ({ types: t }) => {
  const isSourceAttribute = node =>
    t.isJSXIdentifier(node.name, { name: SOURCE_ATTR_NAME })

  const isTargetAttribute = node =>
    t.isJSXIdentifier(node.name, { name: TARGET_ATTR_NAME })

  const buildAttribute = (name, value) => t.JSXAttribute(
    t.JSXIdentifier(name),
    t.isStringLiteral(value) ? value : t.JSXExpressionContainer(value),
  )

  return {
    inherits: jsxSyntax,
    name: 'transform-jsx-css-modules',
    visitor: {
      ImportDeclaration(path, state) {
        if (isCssModuleImport(path.node, state)) {
          const nextImport = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(REFERENCE))],
            t.stringLiteral(path.node.source.value),
          )

          setState(state, 'hasCssModuleImport', true)

          path.replaceWith(nextImport)
        }
      },

      JSXOpeningElement: {
        enter(path, state) {
          if (!hasImportDecl(path, state)) return

          // Reset to empty array for each new attribute
          setClasses(state, [])
        },
        exit(path, state) {
          if (!hasImportDecl(path, state)) return

          const classes = getState(state, 'classes')

          // TRANSFORMATIONS

          if (classes.length > 0) {
            path.node.attributes = path.node.attributes
              .filter(attribute => !isSourceAttribute(attribute))
              .filter(attribute => !isTargetAttribute(attribute))
          }

          if (classes.length === 1) {
            path.node.attributes.push(buildAttribute(
              TARGET_ATTR_NAME,
              classes[0],
            ))
          }

          if (classes.length > 1) {
            if (classes.every(className => t.isStringLiteral(className))) {
              path.node.attributes.push(buildAttribute(
                TARGET_ATTR_NAME,
                t.stringLiteral(
                  classes
                    .map(className => className.value)
                    .join(' '),
                ),
              ))
            } else {
              path.node.attributes.push(buildAttribute(
                TARGET_ATTR_NAME,
                t.callExpression(
                  t.memberExpression(
                    t.arrayExpression(classes),
                    t.identifier('join'),
                  ),
                  [t.stringLiteral(' ')],
                ),
              ))
            }
          }
        },
      },

      JSXAttribute(path, state) {
        if (!hasImportDecl(path, state)) return

        let classes = getClasses(state)

        if (isTargetAttribute(path.node)) {
          if (t.isJSXExpressionContainer(path.node.value)) {
            classes.push(path.node.value.expression)
          }

          if (t.isStringLiteral(path.node.value)) {
            const globalClasses = path.node.value.value
              .split(' ')
              .map(className => t.stringLiteral(className))

            classes = classes.concat(globalClasses)
          }
        }

        if (isSourceAttribute(path.node)) {
          if (t.isJSXExpressionContainer(path.node.value)) {
            classes.push(t.memberExpression(
              t.identifier(REFERENCE),
              path.node.value.expression,
              true,
            ))
          }

          if (t.isStringLiteral(path.node.value)) {
            const scopedClasses = path.node.value.value
              .split(' ')
              .map(className => t.memberExpression(
                t.identifier(REFERENCE),
                t.stringLiteral(className),
                true,
              ))

            classes = classes.concat(scopedClasses)
          }
        }

        setClasses(state, classes)
      },
    },
  }
}
