import WebSocket from 'ws'
import { BotInstance } from '../BotInstance'
import { inflate, InputType } from 'zlib'
import {
  KHEventPacket,
  KHHelloPacket,
  KHOpcode,
  KHPacket,
  KHPingPacket,
  KHReconnectPacket,
} from '../types/kaiheila/packet'
import { MessageSource } from './MessageSource'

export default class WebSocketSource extends MessageSource {
  type = 'websocket'
  socket?: WebSocket
  private compress: boolean
  private helloTimeout: any
  /**
   * -1 错误 0 未连接 1 拉取gateway 2 连接gateway 3 已连接gateway 4 已连接 5 心跳超时
   */
  private stage = 0
  private retryTimes = 0
  private url?: string
  sessionId: string | undefined
  heartbeatInterval: any
  heartbeatTimeout: any

  constructor(self: BotInstance, compress = true) {
    super(self)
    this.compress = compress
  }

  async connect(): Promise<boolean> {
    if (this.stage === 0) {
      this.nextStage()
    }
    return true
  }

  private async getGateWay() {
    try {
      const url = (await this.self.API.gateway.index(this.compress ? 1 : 0)).url
      if (this.stage === 1) {
        this.url = url
        this.nextStage()
      }
    } catch (error) {
      this.retry(error)
    }
  }

  private async dataHandler(data: Buffer | string) {
    let packet: KHPacket
    if (this.compress && Buffer.isBuffer(data)) {
      packet = JSON.parse((await inflatePromise(data)).toString())
    } else {
      packet = JSON.parse(data as string)
    }
    this.onData(packet)
  }

  private onData(packet: KHPacket) {
    switch (packet.s) {
      case KHOpcode.HELLO:
        this.handleHelloPacket(packet)
        break
      case KHOpcode.EVENT:
        this.onEventArrive(packet as KHEventPacket)
        break
      case KHOpcode.PING:
        console.warn('Receive Wrong Direction Packet!')
        break
      case KHOpcode.PONG:
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout)
          this.heartbeatTimeout = undefined
        }
        if (this.stage === 5) {
          this.nextStage()
        }
        break
      case KHOpcode.RECONNECT:
        this.handleReconnectPacket(packet)
        break
      case KHOpcode.RESUME_ACK:
        break
      default:
        console.log(packet)
        break
    }
  }

  private onOpen() {
    this.nextStage()
  }

  private connectSocket() {
    if (this.url) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      if (this.sessionId) {
        this.url += '&resume=1&sessionId=' + this.sessionId + '&sn=' + this.sn
      }
      this.socket = new WebSocket(this.url)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.socket.id = Date.now()
      this.socket.on('message', function (data: any) {
        if (self.socket !== this) {
          this.close()
          return
        }
        self.dataHandler(data)
      })
      this.socket.on('open', function () {
        if (self.socket !== this) {
          this.close()
          return
        }
        self.onOpen()
      })
      this.socket.on('error', function (error: Error) {
        if (self.socket !== this) {
          return
        }
        if (this.readyState === this.CONNECTING || self.stage === 2) {
          console.warn('Fail to Connect to Kaiheila, retrying', error)
          self.socket = undefined
          try {
            this.close()
          } finally {
            // do nothing
          }
          self.retry(error)
        }
        console.warn(error)
      })
      this.socket.on('close', function (code, reason) {
        if (self.socket !== this) {
          return
        }
        self.socket = undefined
        if (self.helloTimeout)
          self.helloTimeout = clearTimeout(self.helloTimeout)
        if (self.heartbeatInterval)
          self.heartbeatInterval = clearInterval(self.heartbeatInterval)
        if (self.heartbeatTimeout)
          self.heartbeatTimeout = clearTimeout(self.heartbeatTimeout)
        if (self.stage === 3) {
          self.retry(
            new Error('close before hello packet ' + code + ' ' + reason)
          )
        }
        if (self.stage === 4 || self.stage === 5) {
          self.retry(new Error(code + ' ' + reason))
        }
      })
    }
  }

  private onHelloTimeout() {
    if (this.socket) {
      this.safeCloseSocket()
      if (this.helloTimeout) {
        clearTimeout(this.helloTimeout)
        this.helloTimeout = undefined
      }
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = undefined
      }
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout)
        this.heartbeatTimeout = undefined
      }
      this.retry(new Error('Hello Packet Timeout'))
    }
  }

  private nextStage() {
    switch (this.stage) {
      case 0:
        this.stage = 1
        this.retryTimes = 0
        this.getGateWay()
        break
      case 1:
        this.stage = 2
        this.retryTimes = 0
        this.connectSocket()
        break
      case 2:
        this.retryTimes = 0
        // wait hello
        this.helloTimeout = setTimeout(() => {
          this.helloTimeout = undefined
          this.onHelloTimeout()
        }, 6000)
        this.stage = 3
        break
      case 3:
        this.retryTimes = 0
        this.startHeartbeat()
        this.stage = 4
        break
      case 4:
        console.error('Wrong next Stage')
        break
      case 5:
        this.retryTimes = 0
        this.stage = 4
        break
      default:
        break
    }
  }

  private async retry(error?: Error) {
    this.retryTimes++
    switch (this.stage) {
      case 0:
        break
      case 1:
        if (this.retryTimes > 3) {
          console.warn('getGateWay Fail over three times, retrying', error)
        }
        await wait(getRetryDelay(2, this.retryTimes, 1, 60))
        this.getGateWay()
        break
      case 2:
        if (this.retryTimes < 3) {
          await wait(getRetryDelay(2, this.retryTimes, 1, 60))
          this.connectSocket()
        } else {
          console.warn(
            'connect to gateway fail over three times, retrying',
            error
          )
          this.stage = 0
          this.nextStage()
        }
        break
      case 3:
        this.stage = 0
        console.warn(error)
        this.nextStage()
        break
      case 4:
        try {
          this.safeCloseSocket()
        } catch (error) {
          // do nothing
        }
        if (this.helloTimeout) {
          clearTimeout(this.helloTimeout)
          this.helloTimeout = undefined
        }
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval)
          this.heartbeatInterval = undefined
        }
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout)
          this.heartbeatTimeout = undefined
        }
        console.warn('connection closed, reconnecting')
        this.stage = 0
        this.nextStage()
        break
      case 5:
        // only heart break timeout should run below code
        if (this.retryTimes < 3) {
          await wait(getRetryDelay(2, this.retryTimes, 1, 60))
          this.heartbeat()
        } else {
          console.warn('heartbeat without reponse over three times', error)
          try {
            this.safeCloseSocket()
          } catch (error) {
            // do nothing
          }
          if (this.helloTimeout) {
            clearTimeout(this.helloTimeout)
            this.helloTimeout = undefined
          }
          if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval)
            this.heartbeatInterval = undefined
          }
          if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout)
            this.heartbeatTimeout = undefined
          }
          this.stage = 0
          this.nextStage()
        }
        break
      case 6:
        break
      case 7:
        break
      default:
        console.warn('should not run to here', error)
        break
    }
  }

  private handleHelloPacket(packet: KHHelloPacket) {
    if (this.helloTimeout) {
      clearTimeout(this.helloTimeout)
      this.helloTimeout = null
    }
    switch (packet.d.code) {
      case 0:
        if (this.sessionId !== packet.d.session_id) {
          this.buffer = []
          this.sn = 0
        }
        this.sessionId = packet.d.session_id
        this.nextStage()
        break
      case 40100:
      case 40101:
      case 40102:
      case 40103:
        console.warn(`Receive ${packet.d.code}, Back to Stage 1`)
        this.safeCloseSocket()
        if (this.helloTimeout) {
          clearTimeout(this.helloTimeout)
          this.helloTimeout = undefined
        }
        this.stage = 0
        this.nextStage()
        break
      default:
        console.warn(`Receive ${packet.d.code}, Ignored`)
        break
    }
  }

  private handleReconnectPacket(packet: KHReconnectPacket) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout)
      this.heartbeatTimeout = undefined
    }
    if (this.helloTimeout) {
      clearTimeout(this.helloTimeout)
      this.helloTimeout = undefined
    }
    this.safeCloseSocket()
    this.stage = 0
    this.sn = 0
    this.sessionId = undefined
    this.buffer = []
    this.nextStage()
    console.warn('Receive Reconnect Packet : ' + JSON.stringify(packet.d))
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      console.warn('Exist Heartbeat Interval , may happen something unexpected')
    }
    this.heartbeatInterval = setInterval(this.heartbeat.bind(this), 30 * 1000)
  }

  private heartbeat() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          s: KHOpcode.PING,
          sn: this.sn,
        } as KHPingPacket)
      )
      this.heartbeatTimeout = setTimeout(
        this.onHeartbeatTimeout.bind(this),
        6 * 1000
      )
    } else if (this.stage === 4) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
      this.stage = 5
      this.retry()
    } else {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }
  }

  private onHeartbeatTimeout() {
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.retry()
    } else {
      console.warn('should not run to here')
    }
  }

  private safeCloseSocket() {
    if (this.socket) {
      const socket = this.socket
      this.socket = undefined
      socket.close
    }
  }
}

function inflatePromise(data: InputType): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    inflate(data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

function getRetryDelay(
  factor: number,
  times: number,
  min: number,
  max: number
) {
  return Math.min(min * Math.pow(factor, Math.max(times - 1, 0)), max)
}

/**
 * 等待指定时间
 * @param time 秒数
 */
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000)
  })
}
