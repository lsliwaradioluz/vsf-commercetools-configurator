import gql from 'graphql-tag';

export default gql`
query {
  categorySearch {
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