import prettyBytes from 'pretty-bytes'
import { assert, isntUndefined } from '@blackglory/prelude'
import { zip } from 'iterable-operator'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'

interface IRecord {
  timestamp: bigint
}

const labelToRecords = new Map<string, Set<IRecord>>()

export function mark(label: string): void {
  if (!labelToRecords.has(label)) {
    const set = new Set<IRecord>()
    labelToRecords.set(label, set)
  }

  const set = labelToRecords.get(label)!
  set.add({ timestamp: process.hrtime.bigint() })
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

  const elapsedTime = new IterableOperator(zip(startRecord, endRecord))
    .map(([startRecord, endRecord]) => endRecord.timestamp - startRecord.timestamp)
    .reduce((average, current) => (average + current) / 2n)

  console.log(`${message}: ${elapsedTime / 1000n / 1000n}ms`)
}

export function getHumanReadableRSS(): string {
  global.gc()
  return prettyBytes(process.memoryUsage().rss)
}
