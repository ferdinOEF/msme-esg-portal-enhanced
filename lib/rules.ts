export type CompanyInput = {
  sector?: string
  size?: 'Micro' | 'Small' | 'Medium' | 'Large' | string
  state?: string
  udyam?: string
  turnoverCr?: number
  compliance: string[]
}

type Bucket = 'mandatory' | 'optional'
type Recommendation = {
  mandatory: string[]
  optional: string[]
  schemes: string[]
}

export function evaluateRules(c: CompanyInput): Recommendation {
  const out: Recommendation = { mandatory: [], optional: [], schemes: [] }
  const push = (bucket: Bucket, text: string) => out[bucket].push(text)

  if (!c.compliance.includes('consents:valid')) {
    push('mandatory', 'Obtain/renew SPCB Consent to Operate (Air/Water Acts)')
  }
  push('mandatory', 'Hazardous & Other Wastes rules compliance (if applicable)')
  push('mandatory', 'OSH & Fire NOC compliance')

  if (['Micro', 'Small'].includes(String(c.size || ''))) {
    out.schemes.push('TEAM', 'ZED', 'GIFT', 'SIDBI-4E')
  }

  if (/food|beverage/i.test(c.sector || '')) {
    push('mandatory', 'Effluent treatment and FSSAI hygiene compliances')
  }
  if (/chem|pharma/i.test(c.sector || '')) {
    push('mandatory', 'Hazardous chemicals storage, MSDS, EPR (where applicable)')
    push('optional', 'Apply for SPICE (circular economy CAPEX subsidy)')
  }
  if ((c.state || '').toLowerCase() === 'goa') {
    push('mandatory', 'GSPCB CTO (Air/Water); verify sector-specific limits & validity')
  }
  return out
}
