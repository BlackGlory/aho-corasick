import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { mark, measure, getHumanReadableRSS } from './utils'
import { readFileLineByLine } from 'extra-filesystem'

const patternsFilename = './patterns.txt'
const sampleFilename = './sample.txt'

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  mark('compilation:start')
  const scanner = new FastScanner(patterns)
  mark('compilation:end')

  let matched = 0
  mark('matching:start')
  for await (const line of readFileLineByLine(sampleFilename)) {
    if (scanner.search(line, { quick: true }).length > 0) matched++
  }
  mark('matching:end')

  measure('compilation', 'compilation:start', 'compilation:end')
  measure('matching', 'matching:start', 'matching:end')
  console.log(`matched: ${matched}`)
  console.log(`rss: ${getHumanReadableRSS()}`)
})
