import { AhoCorasick } from '@src/index'

describe('AhoCorasick', () => {
  describe('findAll(text: string): string[]', () => {
    describe('caseSensitive: true', () => {
      it('return overlapping matches', () => {
        const patterns = ['a', 'ab', 'BC', 'bcd']
        const ac = new AhoCorasick(patterns, { caseSensitive: true })

        const result1 = ac.findAll('abcd')
        const result2 = ac.findAll('ABCD')

        expect(result1).toEqual(['a', 'ab', 'bcd'])
        expect(result2).toEqual(['BC'])
      })
    })

    describe('caseSensitive: false', () => {
      it('return overlapping matches', () => {
        const patterns = ['a', 'ab', 'BC', 'bcd']
        const ac = new AhoCorasick(patterns, { caseSensitive: false })

        const result1 = ac.findAll('abcd')
        const result2 = ac.findAll('ABCD')

        expect(result1).toEqual(['a', 'ab', 'bc', 'bcd'])
        expect(result2).toEqual(['A', 'AB', 'BC', 'BCD'])
      })
    })
  })

  describe('isMatch(text: string): boolean', () => {
    describe('caseSensitive: true', () => {
      describe('match', () => {
        it('return true', () => {
          const patterns = ['hello']
          const ac = new AhoCorasick(patterns, { caseSensitive: true })

          const result = ac.isMatch('hello world')

          expect(result).toBe(true)
        })
      })

      describe('not match', () => {
        it('return false', () => {
          const patterns = ['HELLO']
          const ac = new AhoCorasick(patterns, { caseSensitive: true })

          const result = ac.isMatch('hello world')

          expect(result).toBe(false)
        })
      })
    })

    describe('caseSensitive: false', () => {
      describe('match', () => {
        it('return true', () => {
          const patterns = ['HELLO']
          const ac = new AhoCorasick(patterns, { caseSensitive: false })

          const result = ac.isMatch('hello world')

          expect(result).toBe(true)
        })
      })

      describe('not match', () => {
        it('return false', () => {
          const patterns = ['test']
          const ac = new AhoCorasick(patterns, { caseSensitive: false })

          const result = ac.isMatch('hello world')

          expect(result).toBe(false)
        })
      })
    })
  })
})
