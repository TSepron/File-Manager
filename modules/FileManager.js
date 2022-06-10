import { stdin, stdout } from "process"
import readline from "readline"
import { COMMANDS } from "./commands.js"
import { NavigationCommand } from "./NavigationCmd.js"

export class FileManager {
  #userName
  #systemUser = {
    name: process.env.USERNAME,
    folder: process.env.HOME
  }
  #currentDirectory = this.#systemUser.folder

  #sayGoodbyeToTheUser = () => {
    stdout.write(`Thank you for using File Manager, ${this.#userName}!\n`)
  }

  #sayHiToTheUser = () => {
    console.log(`Welcome to the File Manager, ${this.#userName}!\n`)
  }

  #sayCurrentDirectory = () => {
    console.log(`\nYou are currently in ${this.#currentDirectory}\n`)
  }

  constructor(userName = 'guest') {
    this.#userName = userName
  }

  parseInput(input) {
    return input
      .split(' ')
      .filter(arg => arg !== '')
  }

  async execute(command, args) {
    if (COMMANDS.EXIT.includes(command)) {
      process.exit()
    }

    if (COMMANDS.NAVIGATION.includes(command)) {
      const updatedDirectory = new NavigationCommand({
        command,
        args,
        currentDirectory: this.#currentDirectory
      })
        .execute()
        .getUpdatedDirectory()

      this.#currentDirectory = updatedDirectory
      return
    }

    throw new Error('Invalid input')
  }

  run() {
    this.#sayHiToTheUser()

    const rl = readline.createInterface({
      input: stdin,
    })

    rl.on('line', async input => {
      //change list of available commands in ./commands.js
      const [command, ...args] = this.parseInput(input)

      try {
        rl.pause()
        await this.execute(command, args)
        rl.resume()

        this.#sayCurrentDirectory()
      } catch {
        console.log('Invalid input\n')
      }
    })

    process.on('SIGINT', process.exit)  // CTRL+C
    process.on('exit', this.#sayGoodbyeToTheUser)

    this.#sayCurrentDirectory()
  }
}
