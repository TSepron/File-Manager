import { createReadStream } from 'fs'
import { stdout } from 'process'
import path from "path"
const { createHash } = await import('crypto')

export class HashCommand {
  #command
  #arg
  #currentDirectory

  constructor({command, args, currentDirectory} = {}) {
    if (command == null) {
      throw new Error('command == null')
    }

    if (args.length !== 1) {
      throw new Error('args.length !== 1')
    }

    this.#command = command
    this.#arg = args[0]
    this.#currentDirectory = currentDirectory
  }

  async hash() {
    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#arg)
    )

    await new Promise((resolve, reject) => {
      const hash = createHash('sha256')

      const input = createReadStream(pathToFile)
        .on('end', resolve)
        .on('error', reject)

      input
        .pipe(hash)
        .setEncoding('hex')
        .pipe(stdout)
    })
    console.log('')
  }

  async execute() {
    await this[this.#command]()
    return this
  }
}