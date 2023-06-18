const forge = require('node-forge')
let plaintext =
  'RSA test 한글 테스트 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'

const rsa = forge.pki.rsa

// 1. 키생성
let keyPair = rsa.generateKeyPair({ bits: 2048 })
console.log('Key pair: ', keyPair)
let publicKey = keyPair.publicKey
let privateKey = keyPair.privateKey
console.log('Public key: \n', forge.pki.publicKeyToPem(publicKey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privateKey))

// 2. 서명생성 - 송신자가 송신자의 개인키로 서명
let md1 = forge.md.sha256.create()
md1.update(plaintext, 'utf8')
let sig1 = privateKey.sign(md1)
console.log('Sig1: ' + forge.util.bytesToHex(sig1))

// 송신자가 수신자에게 전송: <plaintext, sig1>

// 3. 서명검증 - 수신자가 송신자의 공개키로 검증
let md2 = forge.md.sha256.create()
md2.update(plaintext, 'utf8')
let result1 = publicKey.verify(md2.digest().bytes(), sig1)
console.log('Result1: ', result1)

// 2. 서명생성 - 송신자가 송신자의 개인키로 서명
let md3 = forge.md.sha256.create()
md3.update(plaintext, 'utf8')
let sig3 = privateKey.sign(md3)
console.log('Sig3: ' + forge.util.bytesToHex(sig3))

// 송신자가 수신자에게 전송: <plaintext, sig1>

// 3. 서명검증 - 수신자가 송신자의 공개키로 검증
let md4 = forge.md.sha256.create()
md4.update(plaintext, 'utf8')
let result4 = publicKey.verify(md4.digest().bytes(), sig3)
console.log('Result4: ', result4)
