import {deepFreeze} from "../utils/deepFreeze.js"

export const COMMANDS = deepFreeze({
  EXIT: ['.exit'],
  NAVIGATION: ['up', 'cd', 'ls'],
  FILES: ['cat', 'add', 'rn', 'cp', 'mv', 'rm'],
  OPERATING_SYSTEM_INFO: ['os'],
  HASH: ['hash'],
  ZLIB: ['compress', 'decompress']
})
