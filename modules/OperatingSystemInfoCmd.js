import os from 'os'

export class OperatingSystemInfoCommand {
  #command
  #arg
  #systemUser

  constructor({command, args, systemUser} = {}) {
    if (command == null) {
      throw new Error('command == null')
    }

    if (args.length !== 1) {
      throw new Error('args.length !== 1')
    }

    if (systemUser == null) {
      throw new Error('currentDirectory == null')
    }

    this.#command = command
    this.#arg = args[0]
    this.#systemUser = systemUser
  }

  execute() {
    switch (this.#arg) {
      case '--EOL':
        console.log(JSON.stringify(os.EOL))
        break
      case '--cpus':
        console.log(os.cpus())
        break
      case '--homedir':
        console.log(os.homedir())
        break
      case '--username':
        console.log(this.#systemUser.name)
        break
      case '--architecture':
        console.log(os.arch())
        break
      default:
        throw new Error('Can not work with this argument')
    }
  }
}