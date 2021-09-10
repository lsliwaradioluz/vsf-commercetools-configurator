import { createApiClient } from "@vue-storefront/commercetools-api/src/index.server";

export default (context) => {
  const { integrations: { ct: { configuration }} } = require(context.nuxt.options.rootDir + '/middleware.config.js');
  const { client } = createApiClient(configuration);
  return client
}