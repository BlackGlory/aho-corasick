export type NativeAhoCorasick = unknown

export interface IAddon {
  createAhoCorasick(
    patterns: string[]
  , options: { caseSensitive: boolean }
  ): NativeAhoCorasick

  isMatch(ac: NativeAhoCorasick, text: string): boolean
  findAll(ac: NativeAhoCorasick, text: string): string[]
}
