import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { AhoCorasick } from '..'
import { Benchmark } from 'extra-benchmark'

const patternsFilename = './patterns.txt'

const benchmark = new Benchmark('Building')

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  benchmark.addCase('fastscan', () => {
    return () => {
      new FastScanner(patterns)
    }
  })

  benchmark.addCase('aho-corasick', () => {
    return () => {
      new AhoCorasick(patterns, { caseSensitive: true })
    }
  })

  console.log(`Benchmark: ${benchmark.name}`)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
