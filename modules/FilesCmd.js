import path from "path"
import { stdout } from "process"
import { createReadStream } from 'fs'

export class FilesCommand {
  #command
  #args
  #currentDirectory

  constructor({command, args, currentDirectory} = {}) {
    if (command == null) {
      throw new Error('command == null')
    }

    if (currentDirectory == null) {
      throw new Error('currentDirectory == null')
    }

    this.#command = command
    this.#args = args
    this.#currentDirectory = currentDirectory
  }

  async cat() {
    if (this.#args.length !== 1)
      throw new Error(`For cat command expected 1 argument`
        + `get ${this.#args.length}`
      )

    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[0])
    )

    for await (const chunk of createReadStream(pathToFile)) {
      stdout.write(chunk.toString())
    }
    console.log('')
  }

  add() {

  }

  rn() {

  }

  cp() {

  }

  mv() {

  }

  rm() {

  }

  async execute() {
    await this[this.#command]()
    return this
  }
}