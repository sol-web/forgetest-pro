const bcrypt = require('bcrypt')

let saltRounds = 12
let myPassword = 'appledlkfjdlskjaflskdjflk'
let myPassword1 = myPassword + '1'
console.log('Password: ' + myPassword)

// 비동기식
// 1. 사용자 등록
bcrypt.hash(myPassword, saltRounds, function (err, hash) {
  console.log('PasswordHash: ' + hash)
  let dbHash = hash

  // 2. 로그인
  bcrypt.compare(myPassword, dbHash, function (err, result) {
    console.log('비동기식' + myPassword + ' - ' + result)
  })
  bcrypt.compare(myPassword1, dbHash, function (err, result) {
    console.log('비동기식' + myPassword1 + ' - ' + result)
  })
})

// 동기식
let hash = bcrypt.hashSync(myPassword, saltRounds)

let result = bcrypt.compareSync(myPassword, hash)
let result1 = bcrypt.compareSync(myPassword1, hash)
console.log('동기식' + myPassword + ' - ' + result)
console.log('동기식' + myPassword1 + ' - ' + result1)
