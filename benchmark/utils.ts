import prettyBytes from 'pretty-bytes'

interface IEntry {
  timestamp: bigint
  rss: number
}

const marks: { [label: string]: IEntry } = {}

export function mark(label: string): void {
  marks[label] = {
    timestamp: process.hrtime.bigint()
  , rss: process.memoryUsage().rss
  }
}

export function getRSS(): number {
  return process.memoryUsage().rss
}

export function measure(
  measureName: string
, startMarkLabel: string
, endMarkLabel: string
): void {
  const startMark = marks[startMarkLabel]
  const endMark = marks[endMarkLabel]

  const elapsedTime = endMark.timestamp - startMark.timestamp
  const rssChanges = endMark.rss - startMark.rss

  console.log(`${measureName} ${elapsedTime / 1000n / 1000n}ms ${prettyBytes(rssChanges)}`)
}
