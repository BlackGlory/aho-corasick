import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { AhoCorasick } from '..'
import { readFileLineByLine } from 'extra-filesystem'
import { Benchmark } from 'extra-benchmark'

const patternsFilename = './patterns.txt'
const sampleFilename = './sample.txt'

const benchmarkBuilding = new Benchmark('Building')
const benchmarkMatching = new Benchmark('Matching')

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  benchmarkBuilding.addCase('fastscan', () => {
    return () => {
      new FastScanner(patterns)
    }
  })

  benchmarkBuilding.addCase('aho-corasick', () => {
    return () => {
      new AhoCorasick(patterns, { caseSensitive: true })
    }
  })

  let fastScanMatched = 0
  benchmarkMatching.addCase('fastscan', () => {
    const scanner = new FastScanner(patterns)

    return async () => {
      for await (const line of readFileLineByLine(sampleFilename)) {
        if (scanner.search(line, { quick: true }).length > 0) {
          fastScanMatched++
        }
      }
    }
  })

  let ahoCorasickMatched = 0
  benchmarkMatching.addCase('aho-corasick', () => {
    const ac = new AhoCorasick(patterns, { caseSensitive: true })

    return async () => {
      for await (const line of readFileLineByLine(sampleFilename)) {
        if (ac.isMatch(line)) {
          ahoCorasickMatched++
        }
      }
    }
  })

  console.log(`Benchmark: ${benchmarkBuilding.name}`)
  for await (const result of benchmarkBuilding.run()) {
    console.log(result)
  }

  console.log('')

  console.log(`Benchmark: ${benchmarkMatching.name}`)
  for await (const result of benchmarkMatching.run()) {
    console.log(result)
  }
  console.log(`fastscan matched: ${fastScanMatched}`)
  console.log(`aho-corasick matched: ${ahoCorasickMatched}`)
})
