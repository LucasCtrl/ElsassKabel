const path = require('path')

exports.onCreateNode = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  let slug

  if (node.internal.type === 'MarkdownRemark') {
    slug = `${node.frontmatter.title.toLowerCase()}/`

    createNodeField({ node, name: 'slug', value: slug })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const productTemplate = require.resolve('./src/templates/productTemplate.js')

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.error) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: '/products/' + node.fields.slug,
      component: productTemplate,
      context: {
        // Additional data can be passed via context
        slug: node.fields.slug,
      },
    })
  })
}
