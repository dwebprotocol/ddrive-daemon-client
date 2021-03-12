const { createMany: hsCreateMany } = require('dhub/test/helpers/create')

const DDriveClient = require('../..')

async function create (numServers, opts) {
  const { servers: daemons, clients, dirs, cleanup } = await hsCreateMany(numServers, opts)
  const driveClients = clients.map(c => {
    return new DDriveClient({ client: c })
  })
  return { dhClients: clients, clients: driveClients, daemons, cleanup, dirs }
}

async function createOne (opts) {
  const { dirs, clients, cleanup, daemons } = await create(1, opts)
  return {
    dir: dirs[0],
    client: clients[0],
    daemon: daemons[0],
    cleanup
  }
}

module.exports = {
  create,
  createOne
}
