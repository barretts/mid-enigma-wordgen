import englishWords from 'an-array-of-english-words';
import { MarkovModel, PreprocessedDictionary } from './types';
import { saveObjectAsJSON } from './helpers';

/**
 * Builds a trigram model from a list of dictionary words.
 */
function buildTrigramModelRestricted(dictionary: string[], allowedLetters: Set<string>): MarkovModel {
  const model: MarkovModel = new Map();

  for (const word of dictionary) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) continue;

    const letters = cleanWord.split("");
    const padded = ["A", "A", ...letters, "Z"];

    for (let i = 0; i < padded.length - 2; i++) {
      const state = padded[i] + padded[i + 1];
      const next = padded[i + 2];

      // Only include valid transitions where all letters are allowed.
      if (
        allowedLetters.has(padded[i]) &&
        allowedLetters.has(padded[i + 1]) &&
        allowedLetters.has(next)
      ) {
        if (!model.has(state)) {
          model.set(state, []);
        }
        model.get(state)!.push(next);
      }
    }
  }
  return model;
}

/**
 * Builds a trigram model from a list of dictionary words.
 */
function buildTrigramModel(dictionary: string[]): MarkovModel {
  const model: MarkovModel = new Map();

  for (const word of dictionary) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) continue;

    const letters = cleanWord.split("");
    const padded = ["A", "A", ...letters, "Z"];

    for (let i = 0; i < padded.length - 2; i++) {
      const state = padded[i] + padded[i + 1];
      const next = padded[i + 2];

      if (!model.has(state)) {
        model.set(state, []);
      }
      model.get(state)!.push(next);
    }
  }
  return model;
}

/**
 * Builds a bigram model from a list of dictionary words.
 */
function buildBigramModel(dictionary: string[]): MarkovModel {
  const model: MarkovModel = new Map();

  for (const word of dictionary) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) continue;

    const letters = cleanWord.split("");
    const padded = ["A", ...letters, "Z"];

    for (let i = 0; i < padded.length - 1; i++) {
      const state = padded[i];
      const next = padded[i + 1];

      if (!model.has(state)) {
        model.set(state, []);
      }
      model.get(state)!.push(next);
    }
  }
  return model;
}

/**
 * Save the models to files
 */


/**
 * Build models and save them
 */
const dictionary: string[] = englishWords;
const dictionarySet: Set<string> = new Set(dictionary.map(word => word.toLowerCase()));
const trigramModel = buildTrigramModel(Array.from(dictionarySet));
const bigramModel = buildBigramModel(Array.from(dictionarySet));
saveObjectAsJSON(trigramModel, "trigramModel");
saveObjectAsJSON(bigramModel, "bigramModel");

const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = ['s', 't', 'p', 'd', 'h', 'n', 'm', 'b', 'l'];
const allowedLetters = new Set([...vowels, ...consonants]);
const trigramModelRestricted = buildTrigramModelRestricted(Array.from(dictionarySet), allowedLetters);
saveObjectAsJSON(trigramModelRestricted, "trigramModelRestricted");


/**
 * Preprocess dictionary into a length-bucketed structure for fast similarity lookup.
 */
function preprocessDictionary(dictionary: string[]): PreprocessedDictionary {
  const processed: PreprocessedDictionary = new Map();
  for (const word of dictionary) {
    // console.log(word);
    const length = word.length;
    if (!processed.has(length)) {
      // console.log('caused new set', length, word)
      processed.set(length, new Set());
    }
    // console.log('added word to set', length, word)
    processed.get(length)!.add(word);
  }
  // console.log(JSON.stringify(processed))
  return processed;
}

const preprocessedDict = preprocessDictionary(dictionary);
saveObjectAsJSON(preprocessedDict, "preprocessedDictionary");

function preprocessDictionaryRestricted(
  dictionary: string[],
  allowedLetters: Set<string>
): PreprocessedDictionary {
  const processed: PreprocessedDictionary = new Map();

  for (const word of dictionary) {
    // Filter out words that contain disallowed letters.
    if (!word.split("").every((char) => allowedLetters.has(char))) {
      continue;
    }

    const length = word.length;
    if (!processed.has(length)) {
      processed.set(length, new Set());
    }
    processed.get(length)!.add(word);
  }

  return processed;
}

const preprocessedDictRestricted = preprocessDictionaryRestricted(dictionary, allowedLetters);
saveObjectAsJSON(preprocessedDictRestricted, "preprocessedDictionaryRestricted");