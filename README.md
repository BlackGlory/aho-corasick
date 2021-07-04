# aho-corasick

A simple Node.js wrapper for [Rust's aho-corasick package].

It's faster than [the fastest pure JS implementation] I know of,
and consumes less memory.

[Rust's aho-corasick package]: https://crates.io/crates/aho-corasick
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

|              | compile time | compile RSS | match time | match RSS | match RSS peak |
|--------------|--------------|-------------|------------|-----------|----------------|
| aho-corasick | 3ms          | +2.08MB     | 19969ms    | +26.3MB   | 81.1MB         |
| fastscan     | 14ms         | +1.35MB     | 29600ms    | +37.0MB   | 90.0MB         |
