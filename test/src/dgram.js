import { test } from 'tapzero'
import * as dgram from '../../dgram.js'
import * as dns from '../../dns.js'
import { Buffer } from '../../buffer.js'

test('dgram', async t => {
  t.ok(dgram, 'dgram is available')
  t.ok(dgram.Socket, 'dgram.Socket is available')
  t.ok(dgram.Socket.length === 1, 'dgram.Socket accepts one argument')
  t.ok(dgram.createSocket, 'dgram.createSocket is available')
  t.ok(dgram.createSocket.length === 2, 'dgram.createSocket accepts two arguments')
  const server = dgram.createSocket({
    type: 'udp4',
    reuseAddr: false
  })
  const client = dgram.createSocket('udp4')
  t.ok(server instanceof dgram.Socket, 'dgram.createSocket returns a dgram.Socket')
  t.ok(server.type === 'udp4', 'dgram.createSocket sets the socket type')
  t.ok(server.state.reuseAddr === false, 'dgram.createSocket sets the reuseAddr option')
  t.ok(server.state.lookup === dns.lookup, 'socket.lookup is the dns.lookup function by default')
  // const msg = new Promise((resolve, reject) => {
  //   server.on('message', resolve)
  //   server.on('error', reject)
  // })
  // server.on('listening', () => {
  //   client.connect(41234, '0.0.0.0', (err) => {
  //     if (err) return t.fail(err)
  //     client.send(Buffer.from('xxx'))
  //   })
  // })
  // t.ok(server.bind(41234) === server, 'dgram.bind returns the socket')
  // t.ok((await msg).startsWith('server got'), 'socket.on("message") is called when a message is received')
})


const makePayload = () => Array(Math.floor(Math.random() * 1024 * 1024)).fill(0).join('')

test('sanity', t => {
  t.ok(true, 'sane')
})

test('sanity', async t => {
  t.ok(true, 'sane')
})

/* test('udp bind, send', async t => {
  const server = io.dgram.createSocket({
    type: 'udp4',
    reuseAddr: false
  })

  t.ok(!!server, 'server exists')
  const client = io.dgram.createSocket('udp4')

  const msg = new Promise((resolve, reject) => {
    server.on('message', resolve)
    server.on('error', reject)
  })

  const payload = makePayload()
  t.ok(payload.length > 0, `${payload.length} bytes prepared`)

  server.on('listening', () => {
    client.send(io.Buffer.from(payload), 41234)
  })

  t.ok(server.bind(41234) === server, 'server returned this')

  try {
    const r = (await msg).toString()
    t.ok(r === payload, `${payload.length} bytes match`)
  } catch (err) {
    console.log(err)
    t.fail(err, err.message)
  }
}) */

test('udp bind, connect, send', async t => {
  const server = io.dgram.createSocket({
    type: 'udp4',
    reuseAddr: false
  })

  const client = io.dgram.createSocket('udp4')

  const msg = new Promise((resolve, reject) => {
    server.on('message', resolve)
    server.on('error', reject)
  })

  const payload = makePayload()

  server.on('listening', () => {
    client.connect(41235, '0.0.0.0', (err) => {
      if (err) return t.fail(err.message)
      client.send(io.Buffer.from(payload))
    })
  })

  t.ok(server.bind(41235) === server)

  try {
    const r = (await msg).toString()
    t.ok(r === payload, `${payload.length} bytes match`)
  } catch (err) {
    console.log(err)
    t.fail(err, err.message)
  }

})