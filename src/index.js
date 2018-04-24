// @flow

const BigNumber = require('bignumber.js')

// prettier-ignore
type Errors = {
  ERROR: Error,
};

// prettier-ignore
type Config = {
  transaction: string
}

// prettier-ignore

const ERRORS = {
  ERROR: new Error('Custome Error')
}

type BUFFERS_TYPE = {
  EXPIRE: Buffer,
  FEES: Buffer,
  DECLARATIONS: Buffer
}

const BUFFERS: BUFFERS_TYPE = {
  EXPIRE: new Buffer(8),
  FEES: new Buffer(1),
  DECLARATIONS: new Buffer(1)
}

export default class CryptographyTask {
  errors: Object
  transaction: Object
  buffers: Buffers

  static get ERRORS(): Errors {
    return ERRORS
  }

  static get BUFFERS(): Buffers {
    return BUFFERS
  }

  constructor(Config: Config) {
    this.errors = CryptographyTask.ERRORS
    this.buffers = CryptographyTask.BUFFERS
    this.transaction = JSON.parse(Config.transaction)
  }

  parseDeclarations() {
    this.buffers.DECLARATIONS.writeUInt8(0)
  }
  
  parseExpire() {
    const expire = new BigNumber(this.transaction.Expire + '')
    const expireLow = parseInt(expire.toString(16).slice(-8), 16)
    const expireHigh = parseInt(expire.toString(16).slice(0, -8), 16)

    this.buffers.EXPIRE = new Buffer(8)
    this.buffers.EXPIRE.writeUInt32LE(expireLow, 0)
    this.buffers.EXPIRE.writeUInt32LE(expireHigh, 4)
  }

  parseFees() {
    if (this.transaction.Fees == null) {
      this.buffers.FEES = new Buffer(1)
      this.buffers.FEES.writeUInt8(0, 0)
    } else {
      this.buffers.FEES = new Buffer(9)
      this.buffers.FEES.writeUInt8(1, 0)
      this.buffers.FEES.writeDoubleLE(this.transaction.Fees, 1)
    }
  }

  methodTest(arg: string): Object {
    return this.errors.ERROR
  }
}
