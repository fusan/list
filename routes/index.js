var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('es6-promise').Promise;

var model = require('../model.js');
	User = model.User;
	Log = model.Log;
	Img = model.Img;
	Memo = model.Memo;

var modal = require('./modal.js');
var update = require('./update.js');

var week = ['日','月','火','水','木','金','土'];

// トップページ 
router.get('/', function(req, res, next) {
	var memberCount,
		initialNum = 100,
		lastNo;

	User.find({},function(err, data) {
		memberCount = data.length;
		lastNo = initialNum + memberCount;
		console.log('会員数　'　+ memberCount, '最後番号　' + lastNo);
		res.render('index', { title: '会員名簿' , memberCount: memberCount, lastNo: lastNo});
	});
});

//全名簿取得
router.get('/allList', function(req, res) {
	//来店履歴を挿入 10件表示　会員番号で昇順
	User.find({}).sort({"会員番号": 1}).limit(100).exec( function(err, data) {
		res.send(data);
	});
});

// 新規登録画面
router.get('/register', function(req, res) {
	User.find({},function(err, data) {
		var initialNum = 100;
		var title,customer,nextNo,html;

		memberCount = data.length;
		nextNo = initialNum + memberCount +1;
		html = modal.register('新規登録','',nextNo);

		res.send({title: '新規登録',customer: '',nextNo: nextNo, html: html});
	});
});

// 新規尊確認画面　入力値の確認画面
router.post('/signUpCheck', function(req, res) {
	var no,name,tel,sex,postcode,address,birthday,eMail,html;
	var customer = {
		title: '確認画面',
		no: req.body.no,
		name: req.body.name,
		ruby: req.body.ruby,
		tel: req.body.tel,
		sex: req.body.sex,
		postcode: req.body.postcode,
		address: req.body.address,
		birthday: req.body.birthday,
		eMail: req.body.eMail
	};
	var data = {};
	data.no = customer.no;
	data.html = modal.signUpCheck(customer);
	console.log(customer.sex);
	res.send(data);
});

//新規にデータベース格納
router.get('/:id(\\d+)', function(req, res) {
	console.log(req.params.id);

	var list = {};
		list['表題'] = req.params.id;
		list['会員番号'] = req.query.no;
		list['氏名'] = req.query.name;
		list['ふりがな'] = req.query.ruby;
		list['電話番号'] = req.query.tel;
		list['性別'] = req.query.sex;
		list['郵便番号'] = req.query.postcode;
		list['住所'] = req.query.address;
		list['生年月日'] = req.query.birthday;
		list['メール'] = req.query.eMail;
		list['更新情報'] = '';
		list['更新カルテ'] = '';
		console.log(list);

	//database挿入
	var member = new User(list);
		member.save(function(err) {
			if(err) throw err;
			User.find({'会員番号': req.query.no}, function(err, data) {
				console.log(data);
			});
		});

	//カードページにリダイレクト
	//res.redirect('/card' + req.query.no);
})

//NO検索
router.get('/card:id(\\d+)', function(req, res) {
	var no = req.params.id;
	
	User.find({'会員番号': no},function(err, data) {
		//var data = JSON.parse(data);
		if(data == '') {
			res.end();
		} else {
			console.log(data);
			var no,name,tel,sex,postcode,address,birthday,eMail;
			var customer = {
				title: data[0]['会員番号'],
				no: data[0]['会員番号'],
				name: data[0]['氏名'],
				ruby: data[0]['ふりがな'],
				tel: data[0]['電話番号'],
				sex: data[0]['性別'],
				postcode: data[0]['郵便番号'],
				address: data[0]['住所'],
				birthday: data[0]['生年月日'],
				eMail: data[0]['メール'],
				karteimg: ''};

			res.render('card', customer);
		}
	});	
});

// 名前検索
router.get('/search', function(req,res) {
	var ruby = req.query.ruby;
	//console.log(name);
	User.where({'ふりがな': {'$regex': ruby}}).exec(function(err, data) {//http://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like
		res.send(data);
	});
});

// 来店履歴入力フォーム
router.get('/appendKarte', function(req, res) {
	var html = modal.append(req);
	res.send(html);
});

// 来店情報をデータベースに格納
router.get('/updateLog', function(req, res) {
	var no = req.query.no;
	//console.log(User.db); mongoose 勉強用

	//来店履歴をデータベースに格納
	var promise = new Promise(function(resolve, reject) {
		update.log(req);
		resolve('ok');//ただのトリガー
	});

	//来店履歴を反映してレンダリング
	promise.then(function(value) {
		User.find({'会員番号': no},function(err, data) {
			var no,name,tel,sex,postcode,address,birthday,eMail;
			var customer = {
				title: data[0]['会員番号'],
				no: data[0]['会員番号'],
				name: data[0]['氏名'],
				ruby: data[0]['ふりがな'],
				tel: data[0]['電話番号'],
				sex: data[0]['性別'],
				postcode: data[0]['郵便番号'],
				address: data[0]['住所'],
				birthday: data[0]['生年月日'],
				eMail: data[0]['メール'],
				karteimg: ''};
			res.render('card', customer);
		});
	});	
});


// 来店履歴訂正フォーム生成
router.get('/modifyKarte', function(req, res) {
	var html = modal.modify(req);
	res.send(html);
});

//来店履歴を訂正　
router.get('/modifyLog', function(req, res) {
	//来店履歴の挿入
	console.log(req.query);
	var promise = new Promise(function(resolve, reject) {
		update.modify(req);
		resolve('ok');
	});

	promise.then(function(value) {
		//リダイレクトするとajaxのloadイベント発火、履歴をロードしなおす。
		res.redirect('/card' + req.query.no);
	});
});

// 更新情報をajaxで取得
router.get('/log', function(req, res) {
	Log.find({'会員番号': req.query.no}, function(err ,data) {
		//console.log('来店履歴取得');
		//console.log(data);
		var html = '';
		for(var i=0,n=data.length; i<n; i++) {
			var date = data[i]['来店日'],
				menu = data[i]['コース'],
				time = data[i]['時間'],
				staff = data[i]['担当'],
				nominee = data[i]['指名'];
				date = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'('+week[date.getDay()]+')';
				html +='<div class="logList"><span style="display: none;">'+ data[i]._id +'</span><span>'+date+'</span>';
				html +='<span>'+ menu + time + '</span><span>担当:'+staff+'</span><span>指名:'+nominee+'</span></div>';	
		}
		res.send(html);
	});
});

//　カルテ画像をデータベースに格納
router.post('/appendIMG', function(req, res) {
	//console.log(req.body);
	var no = parseInt(req.body.no);

	//画像データをデータベースに格納
	var promise = new Promise(function(resolve, reject) {
		update.IMG(req);
		resolve('ok');//ただのトリガー
	});
	
	//データベースから画像履歴を抽出
	promise.then(function(value) {
		Img.find({'会員番号': no}, function(err, data) {
			var imgs = '';
			for(var i=0,n=data.length; i<n; i++) {
				var img = data[i]['カルテ画像'];
				var date = data[i]['保存日'];
				var id = data[i]['_id'];

				date = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'('+week[date.getDay()]+')';

				imgs += '<img src="'+ img +'" alt="'+ id +'"><br>';
				imgs += '<span class="img">No.'+ (i+1) + '__' + date + '</span><br>';
			}
			res.send(imgs);
		});
	});	
});

//カルテ画像の追加
router.get('/kartes', function(req, res) {
	//console.log(data);
	Img.find({'会員番号': req.query.no}, function(err, data) {
			var imgs = '';
			for(var i=0,n=data.length; i<n; i++) {
				var img = data[i]['カルテ画像'];
				var date = data[i]['保存日'];
				var id = data[i]['_id'];

				date = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'('+week[date.getDay()]+')';

				imgs += '<img src="'+ img +'" alt="'+ id +'"><br>';
				imgs += '<span class="img">No.'+ (i+1) + '__' + date + '</span><br>';
			}
			res.send(imgs);
		});
});

//カルテメモ
router.get('/appendMemo', function(req, res) {
	//console.log(req.query);
	//データベースに格納　メモを更新していく。
	var memos = {};
		memos['会員番号'] = req.query.no;
		memos['メモ'] = req.query.memo;

	//database挿入
	//var memo = new Memo(memos);
	Memo.update({'会員番号': req.query.no},{$set: {'メモ': req.query.memo}}, {upsert: true}, function(err, data) {
		console.log('メモに追記')
		console.log(data);
		res.send(req.query);
	});
	
});

router.get('/memos', function(req,res) {
	Memo.find({'会員番号': req.query.no}, function(err, data) {
		!data ? res.end() : res.send(data);
	});
});

//外部データ読み込み xls-to-json でxlsファイルからインポートしてjson出力してそのままデータベースに突っ込む。fileapiをつかて
//ファイル読み込みアップロード、xlsで保存すりようにバリデーションする。
router.get('/inport', function(req, res) {
	fs.readFile('member.json', 'utf8',function(err, data) {
		var json = JSON.parse(data);
		console.log(json[0]);

		for(var i=0,n=2; i<2; i++) {
			var InportUser = new User(json[i]);
			InportUser.save(function(err) {
				if(err) throw err;
				console.log(json[i]['会員番号']);
				User.find({'会員番号': json[i]['会員番号']}, function(err, data) {
					console.log(data);
				});
			});
		}
		//データベースにインポートする
		res.send(json[0]);
	});
});

//誕生月判定
router.get('/birthday', function(req, res) {
	var thisMonth = new Date().getMonth() +1;
	var luckers = [];

	User.find({},function(err, data) {
		for(var i=0,n=data.length;i<n;i++) {
			var day = new Date(data[i]['生年月日']);
			if((day.getMonth() + 1) == thisMonth) {
				var lucker = {};
					lucker.name = data[i]['氏名'];
					lucker.birthday = (day.getMonth() + 1) + '月' +  day.getDate() + '日';

				luckers.push(lucker);
			}
		}
		res.send(luckers);
	});	
});

//解析ページ
router.get('/analytics', function(req, res) {
	var html = modal.analytics(req);
	res.send(html);
});

/*
router.get('/updateLog', function(req,res) {
	//console.log(User);
	Log.update({_id: req.query.count}, {$set: {"時間": 60}}, function(err, numberAffected, raw) {
	  console.log(err); // null
	  console.log(numberAffected); // 1
	  console.log(raw);
	});
	res.send('時間変更しました。');
});*/

//mongodb find 部分一致 http://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like
module.exports = router;
