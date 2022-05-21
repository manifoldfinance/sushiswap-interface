export const GOOGLE_ANALYTICS_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: any) => {
  ;(window as any)?.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
}


// https://developers.google.com/analytics/devguides/collection/gtagjs/events
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const event = ({ action, category, label, value }) => {
  ;(window as any)?.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const exception = ({ description, fatal }) => {
  ;(window as any)?.gtag("event", exception, {
    description,
    fatal,
  })
}


