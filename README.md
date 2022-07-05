# aho-corasick
A simple Node.js wrapper for [Rust's daachorse].

It's faster than [the fastest pure JS implementation] I know of,
and it eats less memory.

[Rust's daachorse]: https://crates.io/crates/daachorse
[the fastest pure JS implementation]: https://www.npmjs.com/package/fastscan

## Install
```sh
npm install --save @blackglory/aho-corasick
# or
yarn add @blackglory/aho-corasick
```

## API
```ts
class AhoCorasick {
  constructor(
    patterns: string[]
  , options: { caseSensitive: boolean }
  )

  isMatch(text: string): boolean
  findAll(text: string): string[]
}
```

## Benchmark
|                                  | Compilation  | Matching       | RSS peak |
|----------------------------------|--------------|----------------|----------|
| daachorse(charwise, from crates) | 11ms +2.94MB | 1289ms +9.64MB | 70.4MB   |
| aho-corasick(NFA, from crates)   | 12ms +9.32MB | 1618ms +11.4MB | 77.2MB   |
| fastscan(from npm)               | 61ms +6.65MB | 2677ms +26.5MB | 90.7MB   |
