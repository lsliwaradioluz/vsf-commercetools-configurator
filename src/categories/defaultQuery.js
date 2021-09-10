import gql from 'graphql-tag';

export default gql`
  query ($filter: [SearchFilter!]) {
  categorySearch(filters: $filter) {
    results {
      id
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