const REFERENCE = '__cssmodule__'

function optionSourceAttribute(state) {
  return state.opts.sourceAttribute || 'styleName'
}

function optionTargetAttribute(state) {
  return state.opts.targetAttribute || 'className'
}

module.exports = function ({ types: t }) {
  function isCssModuleImport(node) {
    return node.specifiers.length === 0 && node.source.value === './styles.css'
  }

  function isSourceAttribute(path, state) {
    const name = optionSourceAttribute(state)
    return t.isJSXIdentifier(path.node.name, { name }) && t.isStringLiteral(path.node.value)
  }

  function containsImport(path, state) {
    return state.file.get('hasCssModuleImport') || path.scope.hasBinding(REFERENCE)
  }

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    name: 'transform-jsx-css-modules',
    visitor: {
      ImportDeclaration(path, state) {
        if (isCssModuleImport(path.node)) {
          const nextImport = t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(REFERENCE))],
            t.stringLiteral(path.node.source.value),
          )

          state.file.set('hasCssModuleImport', true)

          path.replaceWith(nextImport)
        }
      },

      JSXOpeningElement: {
        enter(path, state) {
          if (!containsImport(path, state)) {
            return
          }

          state.file.set('local_attributes', [])
        },
        exit(path, state) {
          if (!containsImport(path, state)) {
            return
          }

          const sourceAttribute = optionSourceAttribute(state)
          const targetAttribute = optionTargetAttribute(state)

          // Remove source attributes
          path.node.attributes = path.node.attributes.filter((attribute) => {
            return !t.isJSXAttribute(attribute) || attribute.name.name !== sourceAttribute
          })

          const classes = state.file.get('local_attributes').map(className => t.memberExpression(
            t.identifier(REFERENCE),
            t.stringLiteral(className),
            true,
          ))

          const value = classes.length === 1 ? classes[0] : t.arrayExpression(classes)

          if (path.node.attributes.find(attribute => attribute.name.name === targetAttribute)) {
            path.node.attributes = path.node.attributes.map(attribute => {
              if (attribute.name.name === targetAttribute) {
                classes.unshift(t.stringLiteral(attribute.value.value))
                const value = classes.length === 1 ? classes[0] : t.arrayExpression(classes)
                return t.JSXAttribute(
                  t.JSXIdentifier(targetAttribute),
                  t.JSXExpressionContainer(value),
                )
              }
              return attribute
            })
          } else {
            path.node.attributes.push(t.JSXAttribute(
              t.JSXIdentifier(targetAttribute),
              t.JSXExpressionContainer(value)
            ))
          }

          state.file.set('local_attributes', [])
        },
      },

      JSXAttribute(path, state) {
        if (!containsImport(path, state)) {
          return
        }

        if (isSourceAttribute(path, state)) {
          const classes = path.node.value.value.split(' ')

          state.file.set('local_attributes', classes)
        }
      },
    },
  }
}
