https://web.archive.org/web/20190529191811/https://www.wolfram.com/language/gallery/generate-random-pronounceable-words/
What is a Bigram and a Trigram?

A bigram is a sequence of two consecutive elements (e.g., letters, words) in a given dataset.
A trigram is a sequence of three consecutive elements.

In the context of Markov models for word generation, we use bigrams and trigrams to predict the next letter based on the previous one (bigram) or previous two (trigram).
Example

Given the word "hello", we can extract:

    Bigrams: "he", "el", "ll", "lo"

    Trigrams: "hel", "ell", "llo"

| Model       | Definition                                              | Pros                                                                       | Cons                                                                                        |
| ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Bigram**  | Predicts next letter based on the last **one** letter.  | ✅ Simpler, needs less data. <br> ✅ Faster word generation.               | ❌ Less structure, more randomness. <br> ❌ Might generate unrealistic letter combinations. |
| **Trigram** | Predicts next letter based on the last **two** letters. | ✅ More context-aware. <br> ✅ Generates more realistic, structured words. | ❌ Requires more training data. <br> ❌ Slightly slower word generation.                    |

When to Use Which?

    Use a Bigram Model if:

        You need a lightweight, fast method for generating words.

        You don't mind if some words are a bit random.

        You have a small dataset to train on.

    Use a Trigram Model if:

        You want more natural, structured, pronounceable words.

        You have enough training data to capture realistic letter sequences.

        You’re okay with slightly slower generation for better quality.
