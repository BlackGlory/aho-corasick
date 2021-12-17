const addon = require('../native')

export class AhoCorasick {
  #instance: unknown

  constructor(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ) {
    this.#instance = addon.createAhoCorasick(patterns, options)
  }

  isMatch(text: string): boolean {
    return addon.isMatch(this.#instance, text)
  }

  findAll(text: string): string[] {
    return addon.findAll(this.#instance, text)
  }
}
