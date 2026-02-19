/**
 * Shared facet filtering utilities.
 *
 * Fields like "Hieratic No", "Phone/Word" store comma-separated raw values
 * (e.g. "nis, aA") while their "Mod" counterparts contain pre-split values
 * (e.g. ["nis", "aA"]). The facet index uses the Mod field, so filter links
 * must target the Mod field with individual values.
 */

/** Fields whose facet index uses a separate "Mod" variant. */
const MOD_FIELDS = ['Item Label', 'Hieratic No', 'Hieroglyph No', 'Phone/Word']

/** Return the facet field name for a given display field. */
export function getFacetField(displayField: string): string {
  if (MOD_FIELDS.includes(displayField)) {
    return displayField + ' Mod'
  }
  return displayField
}

/**
 * Split a raw value string into individual items suitable for facet filtering.
 * Handles commas, parentheses, slashes, equals signs, and multiplication signs.
 */
export function splitForFacet(rawValue: string): string[] {
  const targets = ['(', ')', '=', '\u00d73', '\u00d72', '/', ',']
  let processed = rawValue
  for (const tgt of targets) {
    processed = processed.split(tgt).join('+')
  }
  return processed
    .split('+')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Get the facet field and individual values for a given field.
 * Prefers pre-split Mod values when available, falls back to splitting raw values.
 */
export function getFacetValues(
  data: Record<string, string | string[] | undefined>,
  fieldLabel: string
): { facetField: string; values: string[] } {
  const facetField = getFacetField(fieldLabel)

  // Use pre-split Mod values when available
  if (facetField !== fieldLabel && data[facetField]) {
    const modValues = data[facetField]!
    return {
      facetField,
      values: (Array.isArray(modValues) ? modValues : [modValues]).filter(Boolean),
    }
  }

  // Fallback: split raw values
  const rawValues = data[fieldLabel]
  if (!rawValues) return { facetField, values: [] }

  const rawArr = Array.isArray(rawValues) ? rawValues : [rawValues]
  const values = rawArr.flatMap((v) => splitForFacet(v))
  return { facetField, values }
}
