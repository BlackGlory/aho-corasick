import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { AhoCorasick } from '..'
import { readFileLineByLine } from 'extra-filesystem'
import { Benchmark } from 'extra-benchmark'
import { toArrayAsync } from 'iterable-operator'
import path from 'path'

const patternsFilename = path.join(__dirname, './patterns.txt')
const samplesFilename = path.join(__dirname, './samples.txt')

const benchmarkMatching = new Benchmark('Matching')

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  const samples = await toArrayAsync(readFileLineByLine(samplesFilename))

  let fastScanMatched = 0
  benchmarkMatching.addCase('fastscan', () => {
    const scanner = new FastScanner(patterns)
    const options = { quick: true }

    return () => {
      for (const line of samples) {
        if (scanner.search(line, options).length > 0) {
          fastScanMatched++
        }
      }
    }
  })

  let ahoCorasickMatched = 0
  benchmarkMatching.addCase('aho-corasick', () => {
    const ac = new AhoCorasick(patterns, { caseSensitive: true })

    return () => {
      for (const line of samples) {
        if (ac.isMatch(line)) {
          ahoCorasickMatched++
        }
      }
    }
  })

  console.log(`Benchmark: ${benchmarkMatching.name}`)
  for await (const result of benchmarkMatching.run()) {
    console.log(result)
  }
  console.log(`fastscan matched: ${fastScanMatched}`)
  console.log(`aho-corasick matched: ${ahoCorasickMatched}`)
})
