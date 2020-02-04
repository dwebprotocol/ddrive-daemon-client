const p = require('path')
const chalk = require('chalk')

const loadClient = require('../../lib/loader')
const { normalize, keyForPath } = require('../../lib/cli')
const constants = require('../../lib/constants')

exports.command = 'publish [mnt]'
exports.desc = 'Advertise a Hyperdrive to the network.'
exports.builder = {
  root: {
    description: 'Make your root drive (at ~/Hyperdrive) available to the network',
    type: 'boolean',
    default: false
  },
  announce: {
    description: 'Announce that you\'re seeding the drive to the DHT',
    type: 'boolean',
    default: true
  },
  lookup: {
    description: 'Lookup drive seeders on the DHT',
    type: 'boolean',
    default: true
  },
  remember: {
    description: 'Save this drive\'s networking configuration across restarts',
    type: 'boolean',
    default: true
  }
}

exports.handler = function (argv) {
  let mnt = argv.mnt || process.cwd()
  loadClient((err, client) => {
    if (err) return onerror(err)
    return onclient(client)
  })

  function onclient (client) {
    try {
      mnt = normalize(mnt)
    } catch (err) {
      return onerror(err)
    }
    keyForPath(client, mnt, argv.root, (err, key, isRoot) => {
      if (err) return onerror(err)
      client.fuse.configureNetwork(mnt, {
        lookup: argv.lookup,
        announce: argv.announce,
        remember: argv.remember
      }, (err, rsp) => {
        if (err) return onerror(err)
        return onsuccess(mnt, isRoot)
      })
    })
  }

  function onerror (err) {
    console.error(chalk.red('Could not publish the drive:'))
    console.error(chalk.red(`${err.details || err}`))
    process.exit(1)
  }

  function onsuccess (mnt) {
    console.log(chalk.green(`Published the drive mounted at ${mnt}`))
    process.exit(0)
  }
}
