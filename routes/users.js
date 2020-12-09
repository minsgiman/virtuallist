const express = require('express');
const router = express.Router();
const uuidv3 = require('uuid/v3');
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

router.get('/', function (req, res, next) {
  const page = Math.max(Number(req.query.page) || 1,  1);
  const size = Number(req.query.size) || 10;
  const data = makeDatas(page, size);
  res.json(data);
});

router.get('/view', function (req, res, next) {
  res.render('user.html');
});

/**
 * @param {number} page
 * @param {number} size
 * @returns {object}
 * */
function makeDatas (page, size) {
  const start = ((page - 1) * size) + 1;
  const users = [];

  for (let i = start; i <= page * size; i++) {

    for (let j = 0; j <= 1000; j++) {
      console.log("It's a very slow API........." + j);
    }

    const id = i;
    const key = Math.random().toString(36).substring(7);
    const uuid = uuidv3(key, MY_NAMESPACE);

    users.push({
      "id": id,
      "key": key,
      "uuid": uuid,
      "created": Date.now()
    });
  }

  return {
    "page": page,
    "size": size,
    "result": users
  }
}

module.exports = router;
