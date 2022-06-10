import os from "os"
import path from "path"
import { readdir, lstat } from 'fs/promises'

export class NavigationCommand {
  #command
  #args
  #currentDirectory
  #systemRootDirectory = os.platform() === 'win32'
    ? process.env.SYSTEMDRIVE
    : process.env.SYSTEMROOT

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

  up() {
    this.#currentDirectory = path.resolve(this.#currentDirectory, '..')
  }

  async cd() {
    if (this.#args.length !== 1)
      throw new Error(`For cd command expected 1 argument`
        + `get ${this.#args.length}`
      )

    const pathToNewDirectory = path.normalize(this.#args[0])

    if (
      path.relative(this.#currentDirectory, pathToNewDirectory)
        .includes('..')
    )
      throw new Error(`Path argument should be in `
        + `current directory`
      )

    const newDirectory = path.resolve(this.#currentDirectory, pathToNewDirectory)

    if (!(await lstat(newDirectory)).isDirectory())
      throw new Error(`For cd command argument must `
        + `contain path to folder, not file`
      )

    this.#currentDirectory = newDirectory
  }

  async ls() {
    console.log(await readdir(this.#currentDirectory))
  }

  async execute() {
    await this[this.#command]()
    return this
  }

  getUpdatedDirectory() {
    return this.#currentDirectory
  }
}
