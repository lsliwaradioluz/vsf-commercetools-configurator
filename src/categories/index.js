import query from './defaultQuery';
import gql from 'graphql-tag';

export default async (client, options, context) => {
  const {
    fetchCategories = true,
    categoriesQuery = query 
  } = options;
  if (!fetchCategories) return
  
  const { data: { categorySearch: { results: categories }} } = await client.query({
    query: gql`${categoriesQuery}`,
    fetchPolicy: 'no-cache'
  });

  context.nuxt.options.publicRuntimeConfig.categories = categories;
}