import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { AhoCorasick } from '..'
import { readFileLineByLine } from 'extra-filesystem'
import { Benchmark } from 'extra-benchmark'
import path from 'path'

const patternsFilename = path.join(__dirname, './patterns.txt')
const sampleFilename = path.join(__dirname, './sample.txt')

const benchmarkMatching = new Benchmark('Matching')

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

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

  console.log(`Benchmark: ${benchmarkMatching.name}`)
  for await (const result of benchmarkMatching.run()) {
    console.log(result)
  }
  console.log(`fastscan matched: ${fastScanMatched}`)
  console.log(`aho-corasick matched: ${ahoCorasickMatched}`)
})
