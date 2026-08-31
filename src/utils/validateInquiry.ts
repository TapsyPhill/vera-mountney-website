const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidInquiryEmail(email: string): boolean {
  const value = email.trim()
  return value.length > 0 && EMAIL_PATTERN.test(value)
}

export type InquiryValidationField =
  | 'name'
  | 'email'
  | 'message'
  | 'selectedService'
  | 'preferredContactMethod'
  | 'otherService'

export interface InquiryValidationResult {
  valid: boolean
  fields: InquiryValidationField[]
}

export function validateInquiryFields(input: {
  name: string
  email: string
  message: string
  selectedService: string
  preferredContactMethod: string
  otherService?: string
}): InquiryValidationResult {
  const fields: InquiryValidationField[] = []

  if (!input.name.trim()) fields.push('name')
  if (!isValidInquiryEmail(input.email)) fields.push('email')
  if (!input.message.trim()) fields.push('message')
  if (!input.selectedService.trim()) fields.push('selectedService')
  if (!input.preferredContactMethod.trim()) fields.push('preferredContactMethod')
  if (input.selectedService === 'other' && !input.otherService?.trim()) {
    fields.push('otherService')
  }

  return { valid: fields.length === 0, fields }
}
