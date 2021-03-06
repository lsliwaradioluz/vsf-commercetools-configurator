# vsf-commercetools-configurator
A simple Nuxt module that reads Commercetools project data and generates VSF i18n (locale, country, currency) configuration.

## Why should I use it?
VCC will save you some time by generating your project's `i18n` configuration you'd normally have to do manually. It will:
- set the default currency and country for you (depending on which country you've placed on top of the countries list in your Merchant panel)
- generate `countries` objects (including states: any state you've used for a particular country in any of your project's `taxCategories` will find its way to this object. It means no more problems with disappearing shipping methods in checkout!)
- generate `currencies`
- generate `locales`
- generate `vueI18n.numberFormats`

VCC will also tweak your language/locale settings you'd normally have to edit in `middleware.config.js`:
- generate `acceptLanguages`  (no more problems with product disappearing product names in ProductCards or Cart and Wishlist sidebars!)
- generate `currency`
- generate `country`
## Installation
1. Add the VCC dependency to your package.json:
```json
"dependencies": {
  "@vue-storefront/commercetools-configurator": "git+https://github.com/lsliwaradioluz/vsf-commercetools-configurator.git",
}
```
2. Add the VCC module to your `buildModules` in `nuxt.config.js`:
```js
export default: {
  buildModules: [
    ['@vue-storefront/commercetools-configurator', { /* module options here */}]
  ]
}
```

## Module options
You can customize how VCC works by providing it with appropriate options in `nuxt.config.js`:

```js
export default: {
  buildModules: [
    ['@vue-storefront/commercetools-configurator', {
      replaceRuntimeConfiguration: true,
      writeConfigToFile: false,
      fetchCategories: true,
      categoriesQuery: 'your-custom-query-string-here'
    }]
  ]
}
```
- `replaceRuntimeConfiguration`: If set to true, it will inject the generated configuration into your project's runtime configuration so that everything works out of the box.
- `writeConfigToFile`: If set to true, VCC will write the generated configuration to a JSON file and save it in the root of your Vue Storefront project. You can use the file to verify the generated configuration or to import certain of its key-value pairs into your `nuxt.config.js` and `middleware.config.js` files. The latter works really well if you do not want to leave the process to VCC entirely and wish to have more control over the final configuration.
- `fetchCategories`: VCC can fetch your project category tree which you can later use in your navigation components (for example in your application header). The categories will be stored in Nuxt's `publicRuntimeConfig` and accessible in your components like this:

```js
import { useVSFContext } from '@vue-storefront/core';

setup (props, { root }) {
  // Option 1:
  const { $config: { categories } } = useVSFContext();
  
  // Option 2:
  const const { $config: { categories } } = root;
}
```

- `categoriesQuery`: VCC uses GraphQL to fetch project and category data form Commercetools. This option allows you to modify the default query used to fetch the latter. It can be passed as a plain string - no need to wrap it with the `gql`.



