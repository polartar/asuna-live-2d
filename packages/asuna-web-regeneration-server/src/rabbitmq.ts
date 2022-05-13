import amqp from 'amqplib'

class MessageQueue {
  name: string
  channel: amqp.Channel | undefined

  constructor() {
    this.name = 'loa_task';

    (async () => {
      const conn = await amqp.connect(process.env.RMQ_URI!)
      const chan = await conn.createChannel()
      chan.assertQueue(
        //@ts-ignore: name is assigned
        this.name, {
        durable: true
      })
      this.channel = chan
    })()
  }

  async send(obj: Object) {
    if (this.channel !== undefined) {
      this.channel.sendToQueue(this.name, Buffer.from(JSON.stringify(obj)))
    }
  }
}

export default new MessageQueue()
