import prettyBytes from 'pretty-bytes'
import { assert, isntUndefined } from '@blackglory/prelude'

interface IRecord {
  timestamp: bigint
  rss: number
}

const labelToRecords = new Map<string, IRecord>()

export function mark(label: string): void {
  labelToRecords.set(label, {
    timestamp: process.hrtime.bigint()
  , rss: process.memoryUsage().rss
  })
}

export function measure(
  message: string
, startLabel: string
, endLabel: string
): void {
  const startRecord = labelToRecords.get(startLabel)
  const endRecord = labelToRecords.get(endLabel)
  assert(isntUndefined(startRecord), 'startRecord should not be undefined')
  assert(isntUndefined(endRecord), 'startRecord should not be undefined')

  const elapsedTime = endRecord.timestamp - startRecord.timestamp
  const rssChanges = endRecord.rss - startRecord.rss

  console.log(
    `${message}: ${elapsedTime / 1000n / 1000n}ms ${prettyBytes(rssChanges)}`
  )
}

export function getHumanReadableRSS(): string {
  return prettyBytes(process.memoryUsage().rss)
}
