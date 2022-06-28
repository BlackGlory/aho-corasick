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
|                      | Compilation  | Matching       | RSS peak |
|----------------------|--------------|----------------|----------|
| daachorse(crates)    | 21ms +5.28MB | 1386ms +10.1MB | 72.6MB   |
| aho-corasick(crates) | 12ms +9.32MB | 1618ms +11.4MB | 77.2MB   |
| fastscan(npm)        | 74ms +6.52MB | 2967ms +26.9MB | 90.5MB   |
