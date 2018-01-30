const REFERENCE = '__cssmodule__'

module.exports = function ({ types: t }) {
  function isCssModuleImport(node) {
    return node.specifiers.length === 0 && node.source.value === './styles.css'
  }

  function isClassNameAttribute(node) {
    return t.isJSXIdentifier(node.name, { name: 'className' }) && t.isStringLiteral(node.value)
  }

  function shouldModifyAttribtues(path, state) {
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
      JSXAttribute(path, state) {
        if (!shouldModifyAttribtues(path, state)) {
          return
        }

        if (isClassNameAttribute(path.node)) {
          const classes = path.node.value.value.split(' ')

          const nextClasses = classes.map(className => t.memberExpression(
            t.identifier(REFERENCE),
            t.stringLiteral(className),
            true,
          ))

          const nextAttribute = t.JSXAttribute(
            t.JSXIdentifier('className'),
            t.JSXExpressionContainer(t.arrayExpression(nextClasses))
          )

          path.replaceWith(nextAttribute)
        }
      },
    },
  }
}
