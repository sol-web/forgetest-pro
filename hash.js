const forge = require('node-forge')
let inputText = 'Hash input, 해시함수 테스트 입력'
console.log('해시함수 입력: ' + inputText)

let md = forge.md.md5.create()
md.update(inputText)
let result = md.digest().toHex()
console.log('MD5 해시 출력: ' + result)

let md1 = forge.md.sha1.create()
md1.update(inputText)
let result1 = md1.digest().toHex()
console.log('SHA1 해시 출력: ' + result1)

let md2 = forge.md.sha256.create()
md2.update(inputText)
let result2 = md2.digest().toHex()
console.log('SHA256 해시 출력: ' + result2)

let md3 = forge.md.sha384.create()
md3.update(inputText)
let result3 = md3.digest().toHex()
console.log('SHA384 해시 출력: ' + result3)

let md4 = forge.md.sha512.create()
md4.update(inputText)
let result4 = md4.digest().toHex()
console.log('SHA512 해시 출력: ' + result4)
