import { UselessFact, Language } from '../types';

const API_URL = 'https://uselessfacts.jsph.pl/random.json';
const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

/**
 * Fetches a random useless fact from the external API.
 * If language is 'it', it fetches the English fact and translates it using a public translation API.
 * @param language The language code ('en' or 'it')
 * @returns Promise<UselessFact>
 */
export const fetchRandomFact = async (language: Language = 'en'): Promise<UselessFact> => {
  try {
    // 1. Fetch the fact. For Italian, we request English first (API doesn't support IT natively)
    const sourceLang = language === 'it' ? 'en' : language;
    const response = await fetch(`${API_URL}?language=${sourceLang}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: UselessFact = await response.json();

    // 2. If Italian is requested, translate the text using MyMemory API
    if (language === 'it') {
      try {
        const translateResponse = await fetch(
          `${TRANSLATE_API}?q=${encodeURIComponent(data.text)}&langpair=en|it`
        );
        const translateData = await translateResponse.json();

        if (translateData.responseData && translateData.responseData.translatedText) {
          data.text = translateData.responseData.translatedText;
        }
      } catch (translateError) {
        console.warn('Translation failed, falling back to English', translateError);
        // We do not throw here, we just return the English text as fallback
      }
    }

    return data;
  } catch (error) {
    // Re-throw the error to be handled by the component
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching the fact.');
  }
};