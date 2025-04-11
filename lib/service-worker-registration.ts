// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if we're in the v0 preview environment
const isV0Preview = isBrowser && window.location.hostname.includes("vusercontent.net")

export function registerServiceWorker() {
  // Skip service worker registration in v0 preview or non-browser environments
  if (!isBrowser || isV0Preview) {
    console.log("Skipping service worker registration")
    return
  }

  // Only register service worker in production and if the browser supports it
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    })
  }
}
