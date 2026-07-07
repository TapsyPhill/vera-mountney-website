export type InquirySource = 'contact_form' | 'vera_assistant'

export type InquiryLanguage = 'de' | 'en'

export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp' | 'noPreference'

export interface InquiryPayload {
  name: string
  email: string
  phone?: string
  preferredContactMethod: PreferredContactMethod | string
  selectedService: string
  otherService?: string
  preferredDateTime?: string
  address?: string
  subject?: string
  message: string
  appointmentRequest?: boolean
  language: InquiryLanguage
  source: InquirySource
  botcheck?: string
}

export interface InquirySubmitResult {
  success: boolean
  message?: string
  errors?: string[]
}
