import { promises as fs } from 'fs'
import { go } from '@blackglory/go'
import { AhoCorasick } from '../..'
import { mark, measure, getHumanReadableRSS } from '../utils'
import { readFileLineByLine } from 'extra-filesystem'

const patternsFilename = './patterns.txt'
const sampleFilename = './sample.txt'

go(async () => {
  const text = await fs.readFile(patternsFilename, 'utf-8')
  const patterns = text.split('\n').filter(x => !!x)

  // pre-warm
  for (let i = 100; i--;) {
    const ac = new AhoCorasick(patterns, { caseSensitive: true })
    for await (const line of readFileLineByLine(sampleFilename)) {
      ac.isMatch(line)
    }
  }

  let matched = 0
  for (let i = 100; i--;) {
    mark('compilation:start')
    const ac = new AhoCorasick(patterns, { caseSensitive: true })
    mark('compilation:end')

    mark('matching:start')
    for await (const line of readFileLineByLine(sampleFilename)) {
      if (ac.isMatch(line)) matched++
    }
    mark('matching:end')
  }

  measure('compilation', 'compilation:start', 'compilation:end')
  measure('matching', 'matching:start', 'matching:end')
  console.log(`matched: ${matched}`)
  console.log(`rss: ${getHumanReadableRSS()}`)
})
