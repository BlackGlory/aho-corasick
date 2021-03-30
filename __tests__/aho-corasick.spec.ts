import { AhoCorasick } from '@src/index'

describe('AhoCorasick', () => {
  describe('findAll(text: string): string[]', () => {
    it('return all matches', () => {
      const patterns = ['tell', 'your', 'world']
      const ac = new AhoCorasick(patterns, { caseSensitive: true })

      const result = ac.findAll('tell my world')

      expect(result).toEqual(['tell', 'world'])
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
