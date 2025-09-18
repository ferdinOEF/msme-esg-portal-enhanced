import { evaluateRules } from './rules'

export function recommend(input: any) {
  const parsed = {
    sector: input?.sector,
    size: input?.size,
    state: input?.state,
    udyam: input?.udyam,
    turnoverCr:
      typeof input?.turnoverCr === 'number'
        ? input.turnoverCr
        : input?.turnoverCr
        ? Number(input.turnoverCr)
        : undefined,
    compliance: Array.isArray(input?.compliance) ? input.compliance : [],
  }
  return evaluateRules(parsed)
}
