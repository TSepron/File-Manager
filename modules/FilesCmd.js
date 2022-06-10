import path from "path"
import { mkdir } from 'fs/promises'
import { stdout } from "process"
import { createReadStream, createWriteStream } from 'fs'
import {lstat} from "fs/promises"

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

  async add() {
    if (this.#args.length !== 1)
      throw new Error(`For add command expected 1 argument`
        + `get ${this.#args.length}`
      )

    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[0])
    )

    await new Promise((resolve, reject) => {
      createWriteStream(pathToFile, {"flags":"ax"})
        .on('error', reject)
        .end(() => setInterval(resolve))
    })
  }

  // todo delete
  async rn() {
    if (this.#args.length !== 2)
      throw new Error(`For rn command expected 2 argument`
        + `get ${this.#args.length}`
      )

    const pathToFile = path.resolve(
      this.#currentDirectory,
      path.normalize(this.#args[0])
    )

    if ((await lstat(pathToFile)).isDirectory())
      throw new Error(`For rn command 1-st argument must `
        + `contain path to file, not folder`
      )

    const pathToNewFile = path.resolve(
      this.#currentDirectory,
      path.resolve(
        path.dirname(pathToFile),
        path.normalize(this.#args[1])
      )
    )

    await mkdir(path.dirname(pathToNewFile), {recursive: true})

    await new Promise((resolve, reject) => {
      const readStream = createReadStream(pathToFile)
        .on('error', reject)
        .on('end', resolve)

      const writeStream = createWriteStream(pathToNewFile, {flags: 'ax'})
        .on('error', reject)

      readStream
        .pipe(writeStream)
    })
  }

  async cp() {
    try {
      if (this.#args.length !== 2)
        throw new Error(`For cp command expected 2 argument`
          + `get ${this.#args.length}`
        )

      const pathToFile = path.resolve(
        this.#currentDirectory,
        path.normalize(this.#args[0])
      )
      const fileName = path.basename(pathToFile)

      if ((await lstat(pathToFile)).isDirectory())
        throw new Error(`For cp command 1-st argument must `
          + `contain path to file, not folder`
        )

      const pathToNewDirectory = path.resolve(
        this.#currentDirectory,
        path.normalize(this.#args[1])
      )

      await mkdir(pathToNewDirectory, {recursive: true})

      await new Promise((resolve, reject) => {
        const readStream = createReadStream(pathToFile)
          .on('error', reject)
          .on('end', resolve)

        const writeStream = createWriteStream(
          path.resolve(pathToNewDirectory, fileName),
          {flags: 'ax'}
        )
          .on('error', reject)

        readStream
          .pipe(writeStream)
      })
      console.log('cp end')
    } catch (e) {
      console.log(e)
    }
  }

  mv() {
    if (this.#args.length !== 2)
      throw new Error(`For mv command expected 2 argument`
        + `get ${this.#args.length}`
      )
  }

  rm() {
    if (this.#args.length !== 1)
      throw new Error(`For rm command expected 1 argument`
        + `get ${this.#args.length}`
      )
  }

  async execute() {
    await this[this.#command]()
    return this
  }
}