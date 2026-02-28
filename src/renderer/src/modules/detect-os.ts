// Source - https://stackoverflow.com/a/38241481
// Posted by Vlad Turak, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-27, License - CC BY-SA 4.0

function detectOS(): string {
  let OSName = 'Unknown'
  if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows'
  if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS'
  if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX'
  if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux'

  return OSName
}

export default detectOS
