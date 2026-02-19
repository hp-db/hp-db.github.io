export interface FacetOption {
  label: string
  open: boolean
  orderKey?: string
  orderValue?: string
  size?: number
}

export const facetOptions: Record<string, FacetOption> = {
  'Item Type': {
    label: 'Item Type',
    open: true,
  },
  'Sub Type': {
    label: 'Sub Type',
    open: true,
  },
  Unit: {
    label: 'Unit',
    open: true,
  },
  'Item Label Mod': {
    label: 'Item Label',
    open: true,
  },
  'Hieratic No Mod': {
    label: 'Hieratic No',
    open: true,
  },
  'Category Class': {
    label: 'Category Class',
    open: true,
  },
  'Hieroglyph No Mod': {
    label: 'Hieroglyph No',
    open: true,
  },
  'Phone/Word Mod': {
    label: 'Phone/Word',
    open: true,
  },
  Numeral: {
    label: 'Numeral',
    open: true,
  },
  Vol: {
    label: 'Vol',
    open: true,
  },
}
