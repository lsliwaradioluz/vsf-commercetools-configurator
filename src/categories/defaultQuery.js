import gql from 'graphql-tag';

export default gql`
query {
  categorySearch(queryFilters: ["ancestors:missing"]) {
    results {
      id
      stagedProductCount
      slugAllLocales {
        value
        locale
      }
      nameAllLocales {
        value
        locale
      }
      children {
        ...CategorySearchChildren
        children {
          ...CategorySearchChildren
          children {
            ...CategorySearchChildren
          }
        }
      }
    }
  }
}

fragment CategorySearchChildren on CategorySearch {
  id
  stagedProductCount
  slugAllLocales {
    value
    locale
  }
  nameAllLocales {
    value
    locale
  }
}
`;