import generatei18nConfiguration from './i18n';
import fetchCommercetoolsCategories from './categories';
import createClient from './client';

export default async function CommercetoolsConfiguratorModule (moduleOptions) {
  const client = createClient(this);
  /**
   * We await the generatei18nConfiguration call so that all of the values
   * find their way to the config before the VSFContext gets created
   */
  await generatei18nConfiguration(client, moduleOptions, this);
  fetchCommercetoolsCategories(client, moduleOptions, this)
}