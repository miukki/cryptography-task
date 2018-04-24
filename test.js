const CryptographyTask = require('./dist/index.js').default
const config = {
  transaction:
    '{"Hash":"DWQnIVCxKZ+/XA2Gd5XFrlGJ2JMTuknP6236rl77MsQ=","Expire":636587692108677703,"Inputs":[{"Address":"qyl68tygnjx6qqwrsmynmejmc9wxlw7almv3397j","Currency":"BTC","Amount":10.0},{"Address":"qyaj20aksyvxlfmznyjdqzxrvvf0w7ca7mamwzll","Currency":"LTC","Amount":30.0}],"Outputs":[{"Address":"qyaj20aksyvxlfmznyjdqzxrvvf0w7ca7mamwzll","Currency":"BTC","Amount":10.0},{"Address":"qyl68tygnjx6qqwrsmynmejmc9wxlw7almv3397j","Currency":"LTC","Amount":30.0}],"Message":"\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000","Fees":null}'
}
cryptographyTask = new CryptographyTask(config)
console.log('cryptographyTask.transaction', cryptographyTask.transaction)
cryptographyTask.parseExpire()
cryptographyTask.parseFees()
cryptographyTask.parseDeclarations()
console.log('cryptographyTask.buffers', cryptographyTask.buffers)
