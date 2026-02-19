import { create } from 'zustand'
import { convert2arr } from '@/lib/utils'

interface Advanced {
  q: Record<string, { '+': string[]; '-': string[] }>
  fc: Record<string, { '+': string[]; '-': string[] }>
}

interface SearchState {
  sort: string
  size: number
  from: number
  keyword: string[]
  advanced: Advanced
  currentPage: number
  layout: string
  col: number
  facetFlag: boolean
  facetFlags: Record<string, boolean>
  facetLabels: Record<string, string>
  facetOptions: Record<string, { label: string; open: boolean; orderKey?: string; orderValue?: string; size?: number }>
  result: Record<string, unknown>
  data: unknown[]
  index: Record<string, Record<string, number[]>> | null
  selected: string[]
}

interface SearchActions {
  init: (routeQuery: Record<string, string | string[] | undefined>) => void
  setLayout: (layout: string) => void
  setCol: (col: number) => void
  setResult: (result: Record<string, unknown>) => void
  setFacetLabels: (labels: Record<string, string>) => void
  setFacetOptions: (options: SearchState['facetOptions']) => void
  setFacetFlags: (flags: string[]) => void
  setSize: (size: number) => void
  setSort: (sort: string) => void
  setCurrentPage: (page: number) => void
  setFrom: (from: number) => void
  setFacetFlag: (flag: boolean) => void
  setKeyword: (keyword: string | string[]) => void
  setAdvanced: (data: { label: string; values: string | string[]; type: string }) => void
  removeAdvanced: (data: { label: string; values: string[]; type: string }) => void
  changeFacetFlags: (data: { label: string; value: boolean }) => void
  removeKeyword: (value: string[]) => void
  removeKey: (data: { label: string; value: string[] }) => void
  setData: (data: unknown[]) => void
  setIndex: (index: SearchState['index']) => void
  setSelected: (selected: string[]) => void
}

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  sort: '',
  size: -1,
  from: -1,
  keyword: [],
  advanced: { q: {}, fc: {} },
  currentPage: 1,
  layout: '',
  col: -1,
  facetFlag: true,
  facetFlags: {},
  facetLabels: {},
  facetOptions: {},
  result: {},
  data: [],
  index: null,
  selected: [],

  init: (routeQuery) =>
    set((state) => {
      const keywords = routeQuery.keyword
      const newKeyword = keywords
        ? Array.isArray(keywords)
          ? keywords
          : [keywords]
        : []

      const newAdvanced: Advanced = { q: {}, fc: {} }

      for (const key in routeQuery) {
        const types = ['fc', 'q'] as const
        for (const type of types) {
          if (key.includes(type + '-')) {
            let values = routeQuery[key]
            const valArr = convert2arr(values)

            if (!newAdvanced[type][key]) {
              newAdvanced[type][key] = { '+': [], '-': [] }
            }
            const obj = newAdvanced[type][key]

            for (const value of valArr) {
              if (value.startsWith('-')) {
                obj['-'].push(value.slice(1))
              } else {
                obj['+'].push(value)
              }
            }
          }
        }
      }

      const layout = (routeQuery.layout as string) || 'm_sort:asc'
      const sort = (routeQuery.sort as string) || '_score:desc'
      const from = routeQuery.from ? Number(routeQuery.from) : 0
      const size = routeQuery.size ? Number(routeQuery.size) : 24
      const currentPage = from / size + 1
      const col = routeQuery.col ? Number(routeQuery.col) : 4

      return {
        keyword: newKeyword,
        advanced: newAdvanced,
        layout,
        sort,
        from,
        size,
        currentPage,
        col,
      }
    }),

  setLayout: (layout) => set({ layout }),
  setCol: (col) => set({ col }),
  setResult: (result) => set({ result }),
  setFacetLabels: (facetLabels) => set({ facetLabels }),
  setFacetOptions: (facetOptions) => set({ facetOptions }),
  setFacetFlags: (flags) =>
    set((state) => {
      const newFlags = { ...state.facetFlags }
      for (const field of flags) {
        newFlags[field] = true
      }
      return { facetFlags: newFlags }
    }),
  setSize: (size) => set({ size }),
  setSort: (sort) => set({ sort }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setFrom: (from) => set({ from }),
  setFacetFlag: (facetFlag) => set({ facetFlag }),
  setKeyword: (value) => set({ keyword: convert2arr(value) }),
  setAdvanced: (data) =>
    set((state) => {
      const { label, type } = data
      const values = convert2arr(data.values)
      const newAdvanced = JSON.parse(JSON.stringify(state.advanced)) as Advanced
      const typeKey = type as 'fc' | 'q'
      if (!newAdvanced[typeKey][label]) {
        newAdvanced[typeKey][label] = { '+': [], '-': [] }
      }
      const obj = newAdvanced[typeKey][label]
      for (const value of values) {
        if (value.startsWith('-')) {
          obj['-'].push(value.slice(1))
        } else {
          obj['+'].push(value)
        }
      }
      return { advanced: newAdvanced }
    }),
  removeAdvanced: (data) =>
    set((state) => {
      const { label, values, type } = data
      const newAdvanced = JSON.parse(JSON.stringify(state.advanced)) as Advanced
      const typeKey = type as 'fc' | 'q'
      for (let value of values) {
        let method: '+' | '-' = '+'
        if (value.startsWith('-')) {
          value = value.slice(1)
          method = '-'
        }
        if (newAdvanced[typeKey][label]) {
          newAdvanced[typeKey][label][method] = newAdvanced[typeKey][label][
            method
          ].filter((item) => item !== value)
        }
      }
      return { advanced: newAdvanced }
    }),
  changeFacetFlags: (data) =>
    set((state) => {
      const newOptions = { ...state.facetOptions }
      if (newOptions[data.label]) {
        newOptions[data.label] = { ...newOptions[data.label], open: data.value }
      }
      return { facetOptions: newOptions }
    }),
  removeKeyword: (value) =>
    set((state) => ({
      keyword: state.keyword.filter((n) => !value.includes(n)),
    })),
  removeKey: (data) =>
    set((state) => {
      const key = data.label as keyof SearchState
      const arr = state[key] as string[]
      return { [key]: arr.filter((n: string) => !data.value.includes(n)) } as Partial<SearchState>
    }),
  setData: (data) => set({ data }),
  setIndex: (index) => set({ index }),
  setSelected: (selected) => set({ selected }),
}))
