export type NativeAhoCorasick = unknown

interface IAddon {
  ahoCorasickCreate(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ): NativeAhoCorasick

  ahoCorasickIsMatch(ac: NativeAhoCorasick, text: string): boolean
  ahoCorasickFindAll(ac: NativeAhoCorasick, text: string): string[]
}

export const addon: IAddon = require('../native')
