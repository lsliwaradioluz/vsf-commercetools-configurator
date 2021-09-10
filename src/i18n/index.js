import cl from 'countries-list';
import currencies from '../helpers/currencies.json';
import { injectCountries } from '../helpers/countries';
import {
  getCountryCodeFromLanguage,
  getCurrencyForCountryCode,
  getCurrencyForLanguage,
  getLocaleLabel,
  getStatesPerCountry,
  createMissingLocaleFiles
} from '../helpers';
import query from './defaultQuery';
import fs from 'fs/promises';
import path from 'path';

injectCountries(cl.countries);

export default async (client, options, context) => {
  // Read module options
  const {
    writeConfigToFile = false,
    replaceRuntimeConfiguration = true
  } = options;

  // Generate config references
  const { integrations: { ct: { configuration: settings } } } = require(context.nuxt.options.rootDir + '/middleware.config.js');
  const nuxtConfig = replaceRuntimeConfiguration ? context.options : JSON.parse(JSON.stringify(context.options));
  const middlewareConfig = replaceRuntimeConfiguration ? settings : JSON.parse(JSON.stringify(settings));

  // Get the project data from Commercetools
  const { data: { project, taxCategories: { results: taxCategories } } } = await client.query({
    query,
    fetchPolicy: 'no-cache'
  });
  
  /**
   * To change the default locale, one can overwrite it in the i18n
   * section of nuxt.config.js or simply move it to the top of the list
   * in CT merchant panel's settings > International > Languages
   */
  const defaultCountryStates = getStatesPerCountry(taxCategories);

  nuxtConfig.i18n.defaultLocale = project.languages[0];
  nuxtConfig.i18n.currency = getCurrencyForCountryCode(nuxtConfig.i18n.defaultLocale) || getCurrencyForLanguage(nuxtConfig.i18n.defaultLocale, project.countries);
  nuxtConfig.i18n.country = getCountryCodeFromLanguage(nuxtConfig.i18n.defaultLocale, project.countries);
  nuxtConfig.i18n.vueI18n.fallbackLocale = project.languages[1] || project.languages[0];
  nuxtConfig.i18n.currencies = project.currencies.map(currency => ({ name: currency, label: currencies[currency] && currencies[currency].name }));
  nuxtConfig.i18n.locales = project.languages.map(language => ({ code: language, label: getLocaleLabel(language), file: `${language}.js`, iso: language }));
  nuxtConfig.i18n.countries = project.countries.map(country => ({ name: country, label: cl.countries[country].name, states: defaultCountryStates[country] }));
  nuxtConfig.i18n.vueI18n.numberFormats = project.languages.reduce(
    (numberFormats, language) => Object.assign(
      numberFormats,
      {
        [language]: {
          currency: { style: 'currency', currency: getCurrencyForCountryCode(language) || getCurrencyForLanguage(language, project.countries), currencyDisplay: 'symbol' }
        }
      }
    ), {});

  // Create missing locale files
  createMissingLocaleFiles(nuxtConfig.i18n, context.nuxt.options.rootDir);

  // Set middleware.config.js configuration
  middlewareConfig.acceptLanguage = project.languages;
  middlewareConfig.currency = nuxtConfig.i18n.currency;
  middlewareConfig.country = nuxtConfig.i18n.country;

  if (writeConfigToFile) {
    const configOutput = {
      i18n: nuxtConfig.i18n,
      middleware: middlewareConfig
    }
    fs.writeFile(path.resolve(context.nuxt.options.rootDir, 'config-output.json'), JSON.stringify(configOutput, null, 2));
  }
}