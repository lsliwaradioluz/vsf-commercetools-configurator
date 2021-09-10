# vsf-commercetools-configurator
A simple Nuxt module that reads Commercetools project data and generates VSF i18n (locale, country, currency) configuration.

## Installation
1. Add the VCC dependency to your package.json:
```json
"dependencies": {
  "ct-configurator": "git+https://github.com/lsliwaradioluz/vsf-commercetools-configurator.git",
}
```
2. Add the VCC module to your `buildModules` in `nuxt.config.js`:
```js
export default: {
  buildModules: [
    ['ct-configurator', { /* module options here */}]
  ]
}
```

## Module options
You can customize how VCC works by providing custom options to in in `nuxt.config.js`:

```js
export default: {
  buildModules: [
    ['ct-configurator', {
      replaceRuntimeConfiguration: true,
      writeConfigToFile: false,
      fetchCategories: true,
      categoriesQuery: 'your-custom-query-string-here'
    }]
  ]
}
```
`replaceRuntimeConfiguration`: If set to true, it will inject the generated configuration into your project's runtime configuration so that everything works out of the box.
`writeConfigToFile`: If set to true, VCC will write the generated configuration to a JSON file and save it in the root of your Vue Storefront project. You can use the file to verify the generated configuration or to import certain of its key-value pairs into your `nuxt.config.js` and `middleware.config.js` files. The latter works really well if you do not want to leave the process to VCC entirely and wish to have more control over the final configuration.
`fetchCategories`: VCC can fetch your project category tree which you can later use in your navigation components (for example in your application header). The categories will be stored in Nuxt's `publicRuntimeConfig` and accessible in your components like this:

```js
import { useVSFContext } from '@vue-storefront/core';

setup (props, { root }) {
  // Option 1:
  const { $config: { categories } } = useVSFContext();
  
  // Option 2:
  const const { $config: { categories } } = root;
}
```

`categoriesQuery`: VCC uses GraphQL to fetch project and category data form Commercetools. This option allows you to modify the default query used to fetch the latter. It can be passed as a plain string - no need to wrap it with the `gql`.



