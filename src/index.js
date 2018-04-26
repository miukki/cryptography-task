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

type TxInputOutput = {
  Address: string,
  Currency: string,
  Amount: string
}

const ERRORS = {
  ERROR: new Error('Custome Error')
}

// prettier-ignore
type Buffers = {
  EXPIRE: Buffer,
  FEES: Buffer,
  DECLARATIONS: Buffer,
  INPUTS: Buffer,
  OUTPUTS: Buffer,
  MESSAGE: Buffer,
}

const BUFFERS: Buffers = {
  EXPIRE: new Buffer(8),
  FEES: new Buffer(1),
  DECLARATIONS: new Buffer(1),
  INPUTS: new Buffer(1),
  OUTPUTS: new Buffer(1),
  MESSAGE: new Buffer(1)
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

  //Write(transaction.Expire)
  // protected void Write(long longData)
  // {
  //     stream.Write(BitConverter.GetBytes(longData), 0, 8);
  // }
  //it is meaning 8 bytes  put to Buffer Array
  parseExpire() {
    const expire = new BigNumber(this.transaction.Expire + '')
    const expireLow = parseInt(expire.toString(16).slice(-8), 16)
    const expireHigh = parseInt(expire.toString(16).slice(0, -8), 16)

    this.buffers.EXPIRE = new Buffer(8)
    this.buffers.EXPIRE.writeUInt32LE(expireLow, 0)
    this.buffers.EXPIRE.writeUInt32LE(expireHigh, 4)
  }

  //WriteNullable(transaction.Fees, Write)
  // private void WriteNullable<T>(T data, Action<T> write)
  // {
  //     if (data == null)
  //         Write(false);
  //     else
  //     {
  //         Write(true);
  //         write(data);
  //     }
  // }
  // private void Write(bool value)
  // {
  //     stream.Write(BitConverter.GetBytes(value), 0, 1);
  // }

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

  //just write 1 byte to 0. Idea is if something null or empt dont put it in the json
  parseDeclarations() {
    this.buffers.DECLARATIONS.writeUInt8(0, 0)
  }

  parseInputs() {
    this.buffers.INPUTS = CryptographyTask.txios2Buffer(this.transaction.Inputs)
  }

  parseOutputs() {
    this.buffers.OUTPUTS = CryptographyTask.txios2Buffer(
      this.transaction.Outputs
    )
  }

  static txios2Buffer(txios: Array<TxInputOutput>) {
    const countBuffer = new Buffer(1)
    countBuffer.writeUInt8(txios.length, 0)
    const txiosBuffer = Buffer.concat(
      txios.map(txio => CryptographyTask.txio2Buffer(txio))
    )
    return Buffer.concat([countBuffer, txiosBuffer])
  }

  static txio2Buffer(txio: TxInputOutput) {
    //  addressBuffer unfinished is address, as described the address is encoded in bech32 format.
    //try to decode it. Nodejs bech32 library tips address lacking separate symbol
    const addressBuffer = new Buffer(21) // TODO

    const currencyBuffer = CryptographyTask.currency2Buffer(txio.Currency)
    const amountBuffer = new Buffer(8)
    amountBuffer.writeDoubleLE(+txio.Amount, 0)
    return Buffer.concat([addressBuffer, currencyBuffer, amountBuffer])
  }

  static currency2Buffer(currency: string) {
    let sum = 0
    let multiplier = 1
    for (let i = 0; i < 3; i++) {
      sum += currency.charCodeAt(2 - i) * multiplier
      multiplier *= 26
    }
    const currencyBuffer = new Buffer(2)
    currencyBuffer.writeUInt16LE(sum, 0)
    return currencyBuffer
  }

  parseMessage() {
    //transactionMessage is exactly 10 bytes, that's also the reason we can see 10 \u0000 in message
    //Payment.cs line 179
    this.buffers.MESSAGE.writeUInt8(0, 0)
  }

  toBase64(): string {
    return Buffer.concat([
      this.buffers.EXPIRE,
      this.buffers.FEES,
      this.buffers.DECLARATIONS,
      this.buffers.INPUTS,
      this.buffers.OUTPUTS,
      this.buffers.MESSAGE
    ]).toString('base64')
  }

  methodTest(arg: string): Object {
    return this.errors.ERROR
  }
}
