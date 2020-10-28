function convert2arr(value) {
  let values = []
  if (!Array.isArray(value)) {
    values = [value]
  } else {
    values = value
  }
  return values
}

export const state = () => ({
  sort: '',
  size: -1,
  from: -1,
  keyword: [],
  advanced: {},
  currentPage: 1,
  layout: '',
  col: -1,

  facetFlag: true,
  facetFlags: {},
  facetLabels: {},

  result: {},

  data: [],
  index: null, // 転置インデックス

  // HPDB拡張
  selected: [],
})

export const mutations = {
  init(state, routeQuery) {
    const keywords = routeQuery.keyword
    if (keywords) {
      state.keyword = Array.isArray(keywords) ? keywords : [keywords]
    } else {
      state.keyword = []
    }

    // 要検討
    state.advanced = {
      q: {},
      fc: {},
    }

    for (const key in routeQuery) {
      const types = ['fc', 'q']
      for (let t = 0; t < types.length; t++) {
        const type = types[t]
        if (key.includes(type + '-')) {
          const label = key
          let values = routeQuery[key]
          values = convert2arr(values)

          const advanced = state.advanced[type]
          if (!advanced[label]) {
            advanced[label] = {
              '+': [],
              '-': [],
            }
          }
          const obj = advanced[label]

          for (let i = 0; i < values.length; i++) {
            const value = values[i]
            if (value.startsWith('-')) {
              obj['-'].push(value.slice(1))
            } else {
              obj['+'].push(value)
            }
          }
        }
      }
    }

    const layout = routeQuery.layout
    if (layout) {
      state.layout = layout
    } else {
      state.layout = 'm_sort:asc'
    }

    const sort = routeQuery.sort
    if (sort) {
      state.sort = sort
    } else {
      state.sort = '_score:desc'
    }

    const from = routeQuery.from
    if (from) {
      state.from = Number(from)
    } else {
      state.from = 0
    }

    const size = routeQuery.size
    if (size) {
      state.size = Number(size)
    } else {
      state.size = 24
    }

    const currentPage = state.from / state.size + 1
    state.currentPage = currentPage

    const col = routeQuery.col
    if (col) {
      state.col = Number(col)
    } else {
      state.col = 4
    }
  },
  setLayout(state, layout) {
    state.layout = layout
  },
  setCol(state, value) {
    state.col = value
  },
  setResult(state, value) {
    state.result = value
  },
  setFacetLabels(state, value) {
    state.facetLabels = value
  },
  setFacetFlags(state, flags) {
    for (let i = 0; i < flags.length; i++) {
      const field = flags[i]
      state.facetFlags[field] = true
    }
  },

  setSize(state, value) {
    state.size = value
  },

  setSort(state, value) {
    state.sort = value
  },
  setCurrentPage(state, value) {
    state.currentPage = value
  },
  setFrom(state, value) {
    state.from = value
  },
  setFacetFlag(state, value) {
    state.facetFlag = value
  },
  setKeyword(state, value) {
    state.keyword = convert2arr(value)
  },
  setAdvanced(state, value) {
    const label = value.label
    let values = value.values
    values = convert2arr(values)

    const type = value.type

    const advanced = state.advanced[type]
    if (!advanced[label]) {
      advanced[label] = {
        '+': [],
        '-': [],
      }
    }
    const obj = advanced[label]

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      if (value.startsWith('-')) {
        obj['-'].push(value.slice(1))
      } else {
        obj['+'].push(value)
      }
    }
  },
  removeAdvanced(state, data) {
    const label = data.label
    const values = data.values
    const type = data.type
    const advanced = state.advanced[type]
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
      let method = '+'
      if (value.startsWith('-')) {
        value = value.slice(1)
        method = '-'
      }
      const arr = advanced[label][method]
      advanced[label][method] = arr.filter((item) => item !== value)
    }
  },
  // changeかセットか
  changeFacetFlags(state, data) {
    state.facetFlags[data.label] = data.value
  },
  removeKeyword(state, value) {
    const array = state.keyword
    const newArray = array.filter((n) => !value.includes(n))
    state.keyword = newArray
  },

  // ゆくゆくは統合予定
  removeKey(state, data) {
    const array = state[data.label]
    const newArray = array.filter((n) => !data.value.includes(n))
    state[data.label] = newArray
  },

  // -------------

  setData(state, value) {
    state.data = value
  },

  setIndex(state, value) {
    state.index = value
  },

  // HPDB拡張
  setSelected(state, value) {
    state.selected = value
  },
}
