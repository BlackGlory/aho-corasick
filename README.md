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
The patterns come from the title of the Chinese Wikipedia.
The samples come from the text of the Chinese Wikipedia.

|                  | Compilation   | Matching      |
|------------------|---------------|---------------|
| fastscan         | 2351 op/s     | 16.8 op/s     |
| **aho-corasick** | 2348 op/s     | **63.5 op/s** |

The results of the benchmark are relative values,
which will change according to different patterns and samples.
