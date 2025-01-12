import { GLOBAL_TEST_RUNNER } from 'tapzero'
import { format } from '@socketsupply/io/util.js'
import process from '@socketsupply/io/process.js'

const parent = typeof window === 'object' ? window : globalThis

// uncomment below to get IPC debug output in stdout
// import ipc from '@socketsupply/io/ipc.js'
// ipc.debug.enabled = true
// ipc.debug.log = (...args) => console.log(...args)

if (typeof parent?.addEventListener === 'function') {
  parent.addEventListener('error', onerror)
  parent.addEventListener('unhandledrejection', onerror)
}

['log', 'info', 'warn', 'error', 'debug'].forEach(patchConsole)

const pollTimeout = setTimeout(function poll () {
  if (GLOBAL_TEST_RUNNER.completed) {
    clearTimeout(pollTimeout)
    return process.exit(0)
  }

  setTimeout(poll, 500)
}, 500)

function onerror (err) {
  console.error(err.stack || err.reason || err.message || err)
  process.exit(1)
}

function patchConsole (method) {
  const original = parent.console[method].bind(console)
  parent.console[method] = (...args) => original(format(...args))
}
