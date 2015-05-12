//var jsdom = require('jsdom');
var model = require('../model.js');
	User = model.User;
 	Log = model.Log;
	Img = model.Img;

//来店履歴を挿入
exports.log = function (req) {
	//console.log(req.query);
	req.query.nominee == 'on' ? req.query.nominee = req.query.staff : req.query.nominee = '';
	var update = {};
		update['会員番号'] = req.query.no;
		update['コース'] = req.query.menu;
		update['時間'] = req.query.time;
		update['担当'] = req.query.staff;
		update['指名'] = req.query.nominee;

	//database挿入
	var log = new Log(update);
		log.save(function(err) {
			if(err) throw err;
			Log.find({'会員番号': req.query.no}, function(err, data) {
				console.log('update.LOG() : 来店履歴挿入完了');
				console.log(data);
			});
		});
}

//来店履歴を挿入
exports.modify = function (req) {
	console.log('update.modify() : 来店履歴訂正');
	console.log(req.query);

	//全データの空以外のデータを更新する
	if(req.query.time != '') {
		Log.update({_id: req.query.id}, {$set: {"時間": req.query.time}}, function(err, numberAffected, raw) {
		  console.log(err); // null
		  console.log(numberAffected); // 1
		  console.log(raw);
		});
	}
	if(req.query.staff != '') {
		Log.update({_id: req.query.id}, {$set: {"担当": req.query.staff}}, function(err, numberAffected, raw) {
		  console.log(err); // null
		  console.log(numberAffected); // 1
		  console.log(raw);
		});
	}
	if(req.query.menu != '') {
		Log.update({_id: req.query.id}, {$set: {"コース": req.query.menu}}, function(err, numberAffected, raw) {
		  console.log(err); // null
		  console.log(numberAffected); // 1
		  console.log(raw);
		});
	}
	if(req.query.nominee == 'on') {
		//req.query.nominee = req.query.staff;
		Log.update({_id: req.query.id}, {$set: {"指名": req.query.staff}}, function(err, numberAffected, raw) {
		  console.log(err); // null
		  console.log(numberAffected); // 1
		  console.log(raw);
		});
	}
}

//カルテ画像を挿入
exports.IMG = function (req) {

	var update = {}
		update['会員番号'] = parseInt(req.body.no);
		update['カルテ画像'] = req.body.img;

	//database挿入
	var img = new Img(update);
		img.save(function(err) {
			if(err) throw err;
			Img.find({'会員番号': parseInt(req.body.no)}, function(err, data) {
				console.log('update.IMG() : カルテ画像挿入完了');
				//console.log(data);
			});
		});

}

//全角数字を半角文字に変換
function toInt(str) {
	str = str.replace(/[０-９．]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
        .replace(/[‐－―ー]/g, '-')
        .replace(/[^\-\d\.]/g, '')
        .replace(/(?!^\-)[^\d\.]/g, '');
	return parseInt(str, 10);
};