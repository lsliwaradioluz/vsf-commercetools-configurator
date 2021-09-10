import gql from 'graphql-tag';

export default gql`
query project {
  taxCategories {
    results {
      rates {
        country
        state
      }
    }
  }
  project {
    countries
    currencies
    languages
  }
}
`