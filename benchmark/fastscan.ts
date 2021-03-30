// 翻译自fastscan模块

interface INode {
  next: { [char: string]: INode } // 子节点指针
  value: string  | null // 当前节点的字符，null表示根节点
  back: INode | null // 跳跃指针，也称失败指针
  parent: INode | null// 父节点指针
  accept: boolean // 是否形成了一个完整的词汇，中间节点也可能为true
}

interface IOptions {
  quick?: boolean
  longest?: boolean
}

export class FastScanner {
  root: INode

  constructor(words: string[]) {
    this.root = buildTree(words)
  }

  add(word: string): void {
    word = word.trim()
    if (word.length == 0) return

    addWord(this.root, word)
    fallback(this.root, word)
  }

  // 定位子节点
  locate(word: string): INode {
    let current = this.root.next[word[0]]

    for (let i = 1, len = word.length; i < len; i++) {
      const char = word[i]
      current = current.next[char]
      if (current == null) break
    }

    return current
  }

  hits(content: string, options: IOptions = {}): { [word: string]: number } {
    const offWords = this.search(content, options)
    const seen: { [key: string]: number } = {}

    for (let i = 0; i < offWords.length; i++) {
      const word = offWords[i][1]
      const count = seen[word] || 0
      seen[word] = count + 1
    }

    return seen
  }

  search(content: string, options: IOptions = {}): Array<[offset: number, word: string]> {
    const offWords: Array<[number, string]> = []

    let current = this.root
    for (let i = 0, len = content.length; i < len; i++) {
      const char = content[i]
      let next = current.next[char]
      if (!next) {
        // 当前分支上找不到，跳到其它分支上找
        let back = current.back
        while (back !== null) {
          next = back.next[char]
          if (next) break
          back = back.back
        }
      }

      if (next) {
        let back = next
        do {
          // 收集匹配的词汇
          if (back.accept) {
            const word = collect(back)
            offWords.push([i - word.length + 1, word])
            // 只选第一个词
            if (options.quick) return offWords
          }
          back = back.back!
        } while (back !== this.root)
        current = next
        continue
      }

      // 重置
      current = this.root
    }

    // 同一个位置选最长的
    if (options.longest) return selectLongest(offWords)

    return offWords
  }
}

function buildTree(words: string[]): INode {
  // 词汇去重
  words = dedupAndSort(words)

  const root: INode = {
    next: {} // 子节点指针
  , value: null // 当前节点的字符，null表示根节点
  , back: null // 跳跃指针，也称失败指针
  , parent: null // 父节点指针
  , accept: false // 是否形成了一个完整的词汇，中间节点也可能为true
  }

  // make trie tree
  for (let i = 0; i < words.length; i++) {
    addWord(root, words[i])
  }

  // fix backtrace pointer
  fallbackAll(root)

  return root
}

function dedupAndSort(words: string[]): string[] {
  // 砍掉空格
  words = words.map(word => word.trim())

  // 滤掉空串
  words = words.filter(word => word.length > 0)

  const seen: { [key: string]: boolean } = {}
  const out: string[] = []

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (!seen[word]) {
      seen[word] = true
      out[out.length] = word
    }
  }

  return out.sort()
}

function addWord(root: INode, word: string): void {
  let current = root

  for (let i = 0; i < word.length; i++) {
    const char = word[i]
    const next = current.next[char]

    if (!next) {
      current.next[char] = {
        next: {}
      , value: char
      , accept: false
      , back: root
      , parent: current
      }
    }
    current = current.next[char]
  }

  current.accept = true
}

function fallbackAll(root: INode): void {
  let curExpands: INode[] = Object.values(root.next)

  while (curExpands.length > 0) {
    const nextExpands: INode[] = []

    for (let i = 0; i < curExpands.length; i++) {
      const node: INode = curExpands[i]

      for (const char in node.next) {
        nextExpands.push(node.next[char])
      }

      const parent = node.parent

      let back = parent!.back
      while (back !== null) {
        // 匹配父节点的跳跃节点的子节点
        const child = back.next[node.value!]
        if (child) {
          node.back = child
          break
        }

        back = back.back
      }
    }

    curExpands = nextExpands
  }
}

function fallback(root: INode, word: string): void {
  let current = root.next[word[0]]

  for (let i = 1; i < word.length; i++) {
    const char = word[i]
    const parent = current.parent
    let back = parent!.back
    while (back !== null) {
      // 匹配父节点的跳跃节点的子节点
      const child = back.next[current.value!]
      if (child) {
        current.back = child
        break
      }

      back = back.back
    }

    current = current.next[char]
  }
}

function selectLongest(offsetWords: Array<[number, string]>): Array<[offset: number, word: string]> {
  const stands: { [key: string]: string } = {}

  for (let i = 0; i < offsetWords.length; i++) {
    const offword = offsetWords[i]
    const word = stands[offword[0]]

    if (!word || word.length < offword[1].length) {
      stands[offword[0]] = offword[1]
    }
  }

  const offsets = Object.keys(stands)
    .map(key => Number.parseInt(key))
    .sort((a, b) => a - b)

  return offsets.map(off => [off, stands[off]])
}

// 从子节点往上直到根结点，收集单词
function collect(node: INode): string {
  const word: string[] = []

  while (node.value !== null) {
    word.unshift(node.value)
    node = node.parent!
  }

  return word.join('')
}
