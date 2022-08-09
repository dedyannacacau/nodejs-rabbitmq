import { config } from 'dotenv'
import { connection } from 'mongoose'
import { app } from './app'
import { connectToMongoDB } from './config/db'
import CandleMessageChannel from './messages/CandleMessageChannel'

const createServer = async () => {
  config()

  await connectToMongoDB()
  const PORT = process.env.PORT
  const server = app.listen(PORT, () => console.log(`server listening on port ${PORT}`))

  const candleMessageChannel = new CandleMessageChannel(server)
  candleMessageChannel.cosumeMessages()

  process.on('SIGINT', async () => {
    await connection.close()
    server.close()
    console.log('App server and connection to MongoDB closed')
  })
}
  
createServer()