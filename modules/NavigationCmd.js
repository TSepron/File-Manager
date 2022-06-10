import os from "os"
import path from "path"
import { readdir } from 'fs/promises'

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

  cd() {
    console.log(path.parse(this.#currentDirectory))
  }

  async ls() {
    console.log(await readdir(this.#currentDirectory))
    console.log('')
  }

  async execute() {
    await this[this.#command]()
    return this
  }

  getUpdatedDirectory() {
    return this.#currentDirectory
  }
}
