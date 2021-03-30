import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { FastScanner } from './fastscan'
import { mark, measure, getRSS } from './utils'
import { readFileLineByLine } from 'extra-filesystem'
import prettyBytes from 'pretty-bytes'

const patternsFilename = './patterns.txt'
const sampleFilename = './sample.txt'

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  mark('compile:start')
  const scanner = new FastScanner(patterns)
  mark('compile:end')

  let rssPeak: number = 0
  let matched = 0
  mark('match:start')
  for await (const line of readFileLineByLine(sampleFilename)) {
    if (scanner.search(line, { quick: true }).length > 0) matched++
    updateRSSPeak()
  }
  updateRSSPeak()
  mark('match:end')

  measure('compile', 'compile:start', 'compile:end')
  measure('match', 'match:start', 'match:end')
  console.log(`matched: ${matched}`)
  console.log(`rss peak: ${prettyBytes(rssPeak)}`)

  function updateRSSPeak(): void {
    const rss = getRSS()
    if (rss > rssPeak) rssPeak = rss
  }
})
