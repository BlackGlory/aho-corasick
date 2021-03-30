const addon = require('../native')

export const AhoCorasick = addon.AhoCorasick as IAhoCorasickConstructor

export type IAhoCorasickOptions = { caseSensitive: boolean }

export type IAhoCorasickConstructor =
  new (patterns: string[], options: IAhoCorasickOptions) => IAhoCorasick

export interface IAhoCorasick {
  isMatch(text: string): boolean
  findAll(text: string): string[]
}
