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
|                                 | Compilation  | Matching       | RSS     |
|---------------------------------|--------------|----------------|---------|
| daachorse(charwise) from crates | 16ms         | 38ms           | 99.3 MB |
| fastscan(quick) from npm        | 15ms         | 114ms          | 105 MB  |
