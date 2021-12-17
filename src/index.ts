const addon = require('../native')

export class AhoCorasick {
  private box: any

  constructor(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ) {
    this.box = addon.createAhoCorasick(patterns, options)
  }

  isMatch(text: string): boolean {
    return addon.isMatch(this.box, text)
  }

  findAll(text: string): string[] {
    return addon.findAll(this.box, text)
  }
}
