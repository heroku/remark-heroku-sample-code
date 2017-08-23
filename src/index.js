const rule = require('unified-lint-rule')
const visit = require('unist-util-visit')
const visitAllAfter = require('./visit_all_after')
const Is = require('unist-util-is')

async function commandsHaveExamples (ast, file) {
  let headingFound = false
  let exampleFound = false

  const headingOrExample = async (subNode, index) => {
    if (exampleFound || headingFound) return
    if (subNode.depth === 3 && index !== 0) headingFound = true
    if (Is('code', subNode)) exampleFound = true
  }

  const validate = async (node) => {
    if (node.depth !== 3) return
    headingFound = false
    exampleFound = false

    visitAllAfter(ast, node, headingOrExample)
    if (exampleFound === false) { file.message('Command has no code example', node) }
  }

  await visit(ast, 'heading', validate)
}

module.exports = rule('remark-lint:commands-sample-code', commandsHaveExamples)
