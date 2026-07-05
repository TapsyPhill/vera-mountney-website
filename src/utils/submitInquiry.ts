import type { InquiryPayload, InquirySubmitResult } from '../types/inquiry'

const ENDPOINT = '/api/contact.php'

export async function submitInquiry(payload: InquiryPayload): Promise<InquirySubmitResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = (await response.json()) as InquirySubmitResult

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Request failed',
        errors: data.errors,
      }
    }

    return { success: true }
  } catch {
    return {
      success: false,
      message: 'Network error',
    }
  }
}
