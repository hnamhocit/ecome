export function onRouterTransitionStart(url: string) {
  window.dispatchEvent(new CustomEvent("ecome:navigation-start", { detail: url }))
}
