import { promises as fs } from 'fs';
import path from 'path';
import cl from 'countries-list';

const _getMissingFilesPaths = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch {
    return filePath;
  }
};

/**
 * getDefaultLocaleFilePath chooses 'en' files as the default ones
 * if there are any in the directory. If not, it picks up
 * the first file from the directory instead.
 */
const _getDefaultLocaleFilePath = async (rootDirectoryPath, langDir) => {
  const localeFilesDir = path.resolve(rootDirectoryPath, langDir);
  const jsRegex = /^[^.]+.js$/;
  const existingLocaleFiles = (await fs.readdir(localeFilesDir)).filter(file => jsRegex.test(file));
  const defaultLocaleFile = existingLocaleFiles.find(existingLocaleFile => existingLocaleFile.includes('en')) || existingLocaleFiles[0];
  return path.resolve(localeFilesDir, defaultLocaleFile);
};

export const getStatesPerCountry = (taxCategories) => {
  fs.writeFile(path.resolve('./taxes.json'), JSON.stringify(taxCategories, null, 2));
  return taxCategories.reduce((SPC, taxCategory) => {
    // Get taxCategorySPC object containing all countries codes as keys and their states array as value from each taxCategory's rate
    const taxCategorySPC = taxCategory.rates.reduce((accumulator, rate) => ({
      ...accumulator,
      [rate.country]: [].concat(accumulator[rate.country], rate.state).filter(state => state)
    }), {});

    // Merge taxCategorySPC with SPC without duplicates
    for (const key in taxCategorySPC) {
      if (taxCategorySPC[key].length) {
        const mergedStates = [].concat(SPC[key], ...taxCategorySPC[key]).filter(state => state);
        const mergedStatesWithoutDuplicates = Array.from(new Set(mergedStates));
        SPC[key] = mergedStatesWithoutDuplicates;
      }
    }
    return SPC;
  }, {});
};

export const createMissingLocaleFiles = async (configuration, rootDirectoryPath) => {
  const { locales, langDir } = configuration;
  const defaultLocaleFilePath = await _getDefaultLocaleFilePath(rootDirectoryPath, langDir);

  const pendingFileChecks = locales.map(locale => {
    const fileName = locale.file;
    const filePath = path.resolve(rootDirectoryPath, langDir, fileName);
    return _getMissingFilesPaths(filePath);
  });

  const missingFilesPaths = (await Promise.all(pendingFileChecks)).filter(fileCheck => fileCheck);
  missingFilesPaths.forEach(missingFilePath => {
    if (defaultLocaleFilePath) {
      fs.copyFile(defaultLocaleFilePath, missingFilePath);
    } else {
      fs.open(missingFilePath);
    }
  });
};

export const getLocaleLabel = (language) => {
  const [languageCode, countryCode] = language.split('-');
  const localeLabel = cl.languagesAll[languageCode].name;
  let countryName = '';
  if (countryCode) {
    countryName = ` (${cl.countries[countryCode].name})`;
  }
  return `${localeLabel}${countryName}`;
};

/**
 * getCurrencyForCountryCode returns currency in easy scenarios
 * when the language matches the <languageCode>-<countryCode> pattern.
 * Sometimes there can be a few currencies returned as comma-separated string
 * like in case of US ("USD,USN,USS"). Hence we split the string and only
 * take the first one (firstCurrency)
 */
export const getCurrencyForCountryCode = (language) => {
  const [, countryCode] = language.split('-');
  const currencies = countryCode && cl.countries[countryCode].currency;
  if (!currencies) return
  const firstCurrency = currencies.split(',')[0];
  return firstCurrency;
};

/**
 * getCurrencyForLanguage returns currency in difficult scenarios
 * when the language is just the <languageCode>. It does
 * a sweep of all countries in the project, looks for the one where
 * a given language is the primary one and returns its currency.
 * If none is found, it returns USD by default.
 */
export const getCurrencyForLanguage = (language, countries) => {
  const [languageCode] = language.split('-');
  for (const country of countries) {
    const lookedUpCountry = cl.countries[country];
    const firstLanguage = lookedUpCountry.languages[0];
    if (firstLanguage === languageCode) {
      const currencies = lookedUpCountry.currency;
      const firstCurrency = currencies.split(',')[0];
      return firstCurrency;
    }
  }
  return 'USD';
};

export const getCountryCodeFromLanguage = (language, countries) => {
  const [languageCode, countryCode] = language.split('-');
  if (countryCode) return countryCode;
  for (const country of countries) {
    const lookedUpCountry = cl.countries[country];
    const firstLanguage = lookedUpCountry.languages[0];
    if (firstLanguage === languageCode) {
      return country;
    }
  }
  return 'US';
};

// export default {
//   getStatesPerCountry,
//   createMissingLocaleFiles,
//   getLocaleLabel,
//   getCurrencyForCountryCode,
//   getCurrencyForLanguage,
//   getCountryCodeFromLanguage
// }