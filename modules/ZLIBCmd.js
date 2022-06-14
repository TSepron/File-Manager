import path from "path"
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import zlib from 'zlib'

export class ZLIBCmd {
  #command
  #args
  #currentDirectory

  constructor({command, args, currentDirectory} = {}) {
    if (command == null) {
      throw new Error('command == null')
    }

    if (args.length !== 2)
      throw new Error(`For compress command expected 2 argument`
        + `get ${this.#args.length}`
      )

    if (currentDirectory == null) {
      throw new Error('currentDirectory == null')
    }

    this.#command = command
    this.#args = args
    this.#currentDirectory = currentDirectory
  }

  async compress() {
    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[0])
    )

    const pathToDestination = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[1])
    )

    const source = createReadStream(pathToFile)

    const destination = createWriteStream(pathToDestination)

    await pipeline(
      source,
      zlib.createBrotliCompress(),
      destination
    )
  }

  async decompress() {
    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[0])
    )

    const pathToDestination = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[1])
    )

    const source = createReadStream(pathToFile)

    const destination = createWriteStream(pathToDestination)

    await pipeline(
      source,
      zlib.createBrotliDecompress(),
      destination
    )
  }

  async execute() {
    await this[this.#command]()
    return this
  }
}