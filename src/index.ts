import fs from 'fs';
import englishWords from 'an-array-of-english-words';
import levenshtein from 'fast-levenshtein';
import { MarkovModel, PreprocessedDictionary } from './types';
import { loadObjectFromJSON } from './helpers';
let usedWords: Set<string> = new Set();

function weightedRandomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? 'e' as T;
}

const isPronounceable = (word: string): boolean => {
  const badPatterns = [
    /[^aeiou]{4,}/, // No more than 3 consonants in a row
    /[aeiou]{4,}/,  // No more than 3 vowels in a row
    // /(.).*\1/, // No duplicate letters
    // /(.)\1\1/, // No more than 2 duplicate letters
    /zr|tssr|mptl|rlp|tns/, // Ban difficult phonetic combinations
  ];
  return !badPatterns.some(pattern => pattern.test(word));
}

const isSimilarToRealWord = (word: string, preprocessedDictionary: PreprocessedDictionary, threshold = 3): boolean => {
  if (!word || !preprocessedDictionary) {
    throw new Error("Missing required properties");
  }
  const possibleMatches = new Set<string>();
  const length = word.length;

  for (let i = length - 1; i <= length + 1; i++) {
    if (preprocessedDictionary.has(i)) {
      for (const realWord of preprocessedDictionary.get(i)!) {
        possibleMatches.add(realWord);
      }
    }
  }

  return Array.from(possibleMatches).some(realWord => levenshtein.get(word, realWord) <= threshold);
}

interface GenerateNonEnglishWordProps {
  trigramModel: MarkovModel;
  preprocessedDictionary: PreprocessedDictionary;
  minLength?: number;
  maxLength?: number;
}

// Helper to generate tokens from the trigram model.
// Starts with ["A", "A"] and appends tokens until the stop marker "Z"
// or the maximum word length is reached.
const generateTokens = (
  trigramModel: MarkovModel,
  maxLength: number
): string[] => {
  const tokens: string[] = ["A", "A"];

  // Loop until the stop marker "Z" is encountered or the maximum token count is met.
  while (tokens[tokens.length - 1] !== "Z" && tokens.length - 2 < maxLength) {
    // Use slice(-2) to safely get the last two tokens.
    const state = tokens.slice(-2).join("");
    // Get choices from the model; fallback to ["e"] if no choices available.
    const choices = trigramModel.get(state) ?? ["e"];
    tokens.push(weightedRandomChoice(choices));
  }
  return tokens;
};

// We remove the first two starting tokens and the final stop marker.
const extractWordFromTokens = (tokens: string[]): string => {
  return tokens.slice(2, -1).join("");
};

const generateBetterWord = ({
  trigramModel,
  minLength = 5,
  maxLength = 12,
  preprocessedDictionary,
}: GenerateNonEnglishWordProps): string => {
  let word: string = "";

  do {
    const tokens = generateTokens(trigramModel, maxLength);
    word = extractWordFromTokens(tokens);

    // If the word has been used already, simply continue the loop.
    if (usedWords.has(word)) {
      continue;
    }
  } while (
    word.length < minLength ||
    !isPronounceable(word) ||
    !isSimilarToRealWord(word, preprocessedDictionary)
  );

  return word;
};

export const generateNonEnglishWord = ({
  trigramModel,
  minLength = 5,
  maxLength = 12,
  preprocessedDictionary
}: GenerateNonEnglishWordProps): string => {
  let word: string;
  do {
    word = generateBetterWord({ trigramModel, minLength, maxLength, preprocessedDictionary });
  } while (preprocessedDictionary.get(word.length)!.has(word)); // Repeat until we find a unique word
  return word;
}

const trigramModel = loadObjectFromJSON<MarkovModel>("trigramModel");

if (trigramModel === undefined) {
  throw new Error("Trigram model not found");
}

const preprocessedDictionary = loadObjectFromJSON<PreprocessedDictionary>("preprocessedDictionary");

if (preprocessedDictionary === undefined) {
  throw new Error("Preprocessed dictionary not found");
}

let x = 1;
while (x < 100) {
  const wrd = generateNonEnglishWord({ trigramModel, preprocessedDictionary, minLength: 9, maxLength: 14 });
  console.log('word:', wrd);
  usedWords.add(wrd);
  x++;
}

// console.log("used words:", JSON.stringify(usedWords));

