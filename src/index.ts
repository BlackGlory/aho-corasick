type NativeAhoCorasick = unknown

interface IAddon {
  createAhoCorasick(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ): NativeAhoCorasick

  isMatch(ac: NativeAhoCorasick, text: string): boolean
  findAll(ac: NativeAhoCorasick, text: string): string[]
}

const addon: IAddon = require('../native')

export class AhoCorasick {
  private instance: NativeAhoCorasick

  constructor(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ) {
    this.instance = addon.createAhoCorasick(patterns, options)
  }

  isMatch(text: string): boolean {
    return addon.isMatch(this.instance, text)
  }

  findAll(text: string): string[] {
    return addon.findAll(this.instance, text)
  }
}
