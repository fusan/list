var model = require('../model.js');
	User = model.User;
 	Log = model.Log;
	Img = model.Img;

exports.LOG = function (req) {
	console.log('dom.log');
	console.log(req.query);
	
	Log.find({'会員番号': req.query.no}, function(err ,data) {
		//console.log('来店履歴取得');
		//console.log(data);
		var week = ['日','月','火','水','木','金','土'];
		var html = '';
		for(var i=0,n=data.length; i<n; i++) {
			var date = data[i]['来店日'],
				menu = data[i]['コース'],
				time = data[i]['時間'],
				staff = data[i]['担当'],
				nominee = data[i]['指名'];
				date = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()+'('+week[date.getDay()]+')';
				html +='<div class="list"><span style="display: none;">'+ data[i]._id +'</span><span>'+date+'</span>';
				html +='<span>'+ menu + time + '</span><span>担当:'+staff+'</span><span>指名:'+nominee+'</span></div>';	
		}
		//console.log(html);
		return html;
	});
	
}

