const p = require('path').posix
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const { normalize, keyForPath } = require('../../lib/cli')
const constants = require('../../lib/constants')

exports.command = 'key [path]'
exports.desc = 'Display the key for the drive mounted at the given mountpoint.'
exports.builder = {
  root: {
    description: 'Show the key of your private root drive.',
    type: 'boolean',
    default: false
  }
}

exports.handler = function (argv) {
  let path = argv.path || process.cwd()
  try {
    path = normalize(path)
  } catch (err) {
    return onerror(err)
  }

  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    keyForPath(client, path, argv.root, (err, key, isRoot) => {
      if (err) return onerror(err)
      return onsuccess(key, isRoot)
    })
  }

  function onerror (err) {
    console.error(chalk.red(`Could get the drive key for mountpoint: ${path}`))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (key, root) {
    console.log(chalk.green(key))
    if (root) console.log(chalk.blue('\nThis is your root drive key. You probably should not share this.'))
  }
}
