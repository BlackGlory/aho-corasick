import { NativeAhoCorasick, addon } from './addon'

export class AhoCorasick {
  private instance: NativeAhoCorasick

  constructor(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ) {
    this.instance = addon.ahoCorasickCreate(patterns, options)
  }

  isMatch(text: string): boolean {
    return addon.ahoCorasickIsMatch(this.instance, text)
  }

  findAll(text: string): string[] {
    return addon.ahoCorasickFindAll(this.instance, text)
  }
}
