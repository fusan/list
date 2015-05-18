var mongoose = require('mongoose');
var url = 'mongodb://localhost/list';//mongodb://dbuser:dbpass@52.68.62.98/list
var db = mongoose.createConnection(url, function(err, res) {
	if(err) {
		console.log('error connected:' + url + '-' + err);
	} else {
		console.log('Success connected:' + url);
	}
});

var UserSchema = new mongoose.Schema({
	'来店日': { type: Date, default: Date.now},
	'会員番号': Number,
	'氏名': String,
  'ふりがな': String,
  '性別': String,
  '郵便番号': String,
  '住所': String,
	'電話番号': String,
  '生年月日': Date,
  'メール': String,//年齢は計算
  '来店回数': String
  //'経路': String,
  //'初回担当': String,
  //'初回コース': String
}, {collection: 'memberList'});

var UserSchema2 = new mongoose.Schema({
  '来店日': { type: Date, default: Date.now},
  '会員番号': Number,
  'コース' : String,
  '時間': Number,
  '担当': String,
  '指名': String
  //'カルテ画像': String
}, {collection: 'log'});

var UserSchema3 = new mongoose.Schema({
  '保存日': { type: Date, default: Date.now},
  '会員番号': Number,
  'カルテ画像' : String
  //'カルテ画像': String
}, {collection: 'img'});

var UserSchema4 = new mongoose.Schema({
  '記入日': { type: Date, default: Date.now},
  '会員番号': Number,
  'メモ': String
}, {collection: 'memo'});

exports.User = db.model('User', UserSchema);
exports.Log = db.model('Log', UserSchema2);
exports.Img = db.model('Img', UserSchema3);
exports.Memo = db.model('Memo', UserSchema4);

