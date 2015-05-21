//会員登録画面
exports.register = function (title,customer,nextNo) {

	var html = '<h3>'+title+'</h3>';
	    html += '<div id="registerWindowInnerForm">';
	    html += '<span class="label">会員番号</span><span><input type="number" value="'+ nextNo +'" name="no" placeholder="101" required></span><br>';
	    html += '<span class="label">氏名</span><input type="text" name="name" value="" placeholder="山田　隆之" required><span class="caution"></span><br>';
	    html += '<span class="label">よみがな</span><input type="text" name="ruby" value="" placeholder="やまだ　たかゆき" required><span class="caution"></span><br>';
	    html += '<span class="label">性別</span><input type="radio" name="sex" value="女性">女性<input type="radio" name="sex" value="男性">男性<br>';
	    html += '<span class="label">郵便番号</span><input type="text" name="postcode" value="" placeholder="100-0000" size="10" maxlength="8" ><br>';
	  	html += '<span class="label">住所</span><input type="text" name="address" value="" placeholder="東京都" size="60"><br>';
	    html += '<span class="label">生年月日</span><input type="text" name="birthday" value="" placeholder="2015.1.1"　value="2012.02.16"><button id="AD">元号変換</button><br>';
	    html += '<span class="label">メール</span><input type="mail" name="eMail" value="" placeholder="test@gmail.com"><br>';
	    html += '<span class="label">電話</span><input type="tel" name="tel" value="" placeholder="090-3456-1234"><span class="caution"></span><br>';
	    html += '<span id="signUpCheck">&not;</span><span id="cancel">&times;</span>'; 
	    html += '</div>';

    //console.log(html);
    return html;
}

//会員情報確認フォーム
exports.signUpCheck = function (customer) {

	var html = '<h3>'+customer.title+'</h3>';
	    html += '<div id="registerWindowInnerForm">';
	    html += '<span class="label">会員番号</span><span><input type="number" value="'+ parseInt(customer.no) +'" name="no" placeholder="101" required></span><br>';
	    html += '<span class="label">氏名</span><span><input type="text" name="name" value="'+ customer.name +'" placeholder="山田　隆之" required></span><span class="caution"></span><br>';
	    html += '<span class="label">よみがな</span><input type="text" name="ruby" value="'+ customer.ruby +'" placeholder="やまだ　たかゆき" required><span class="caution"></span><br>';
	    html += '<span class="label">性別</span><input type="radio" name="sex" value="'+ customer.sex +'" checked>'+customer.sex+'<br>';
	    html += '<span class="label">郵便番号</span><input type="text" name="postcode" value="'+ customer.postcode +'" placeholder="100-0000" size="10" maxlength="8"><br>';
	  	html += '<span class="label">住所</span><input type="text" name="address" value="'+ customer.address +'" placeholder="東京都" size="60"><br>';
	    html += '<span class="label">生年月日</span><input type="text" name="birthday" value="'+ customer.birthday +'" placeholder="2015.1.1"　value="2012.02.16"><br>';
	    html += '<span class="label">メール</span><input type="mail" name="eMail" value="'+ customer.eMail +'" placeholder="test@gmail.com"><br>';
	    html += '<span class="label">電話</span><input type="tel" name="tel" value="'+ customer.tel +'" placeholder="090-3456-1234"><span class="caution"></span><br>';
	    html += '<span id="create">></span><span id="cancel">&times;</span>'; 
	    html += '</div>';

    //console.log(html);
    return html;
}

//来店履歴入力フォーム
exports.append = function (req) {
	console.log(req.query);
	var today = new Date(),
		month = today.getMonth() + 1,
		date = today.getDate(),
		day = parseInt(today.getDay());

	var dayArray = ['日','月','火','水','木','金','土'];

	var html = '<h3>来店履歴入力</h3>';
		html += '<form action="/updateLog" method="get" name="karte"> ';
		//html += '<input type="submit" name="update" id="update" value="更新">';
		html += '<span><input type="hidden" name="no" value="'+ req.query.no +'"></span><br>';
		html += '<span>コース:</span><input type="text" name="menu" placeholder="B"><br>';
		html += '<span>時間:</span><input type="number" name="time" placeholder="60"><br>';
		html += '<span>担当:</span><input type="text" name="staff" placeholder="藤井"><br>';
		html += '<span>指名:</span><input type="radio" name="nominee"><br>';
		html += '<span>日付:</span><span>' + month + '月' + date + '日' + '(' + dayArray[day] + ')</span><br>';
		html += '<input type="submit" name="save" id="save" value="&not;">';
		html += '<input type="reset" name="cancel" id="cancel" value="&times;">';
		html += '</form>';

		//console.log(html);
	return html;
	//jsodomを使う予定
}

//来店履歴修正フォーム
exports.modify = function (req) {
	console.log(req.query);
	var today = new Date(),
		month = today.getMonth() + 1,
		date = today.getDate(),
		day = parseInt(today.getDay());

	var dayArray = ['日','月','火','水','木','金','土'];

	var html = '<h3>履歴訂正</h3>';
		html += '<form action="/modifyLog" method="get" name="karte"> ';
		html += '<span><input type="hidden" name="no" value="'+ req.query.no +'"></span><br>';
		html += '<span>コース:</span><input type="text" name="menu" placeholder="B"><br>';
		html += '<span>時間:</span><input type="number" name="time" placeholder="60"><br>';
		html += '<span>担当:</span><input type="text" name="staff" placeholder="≧(・─・)≦"><br>';
		html += '<span>指名:</span><input type="radio" name="nominee" value="on"><br>';
		html += '<span><input type="hidden" name="id" value="'+ req.query.count +'"></span><br>';
		//html += 'ー＞フォームをポストする　ー＞　moongoose で　訂正　ー＞　card.ejsにdataを渡す';
		html += '<input type="submit" name="update" id="update" value="&not;">';
		html += '<input type="reset" name="cancel" id="cancel" value="&times;">';
		html += '</form>';
		html += '<form action="/removeLog" method="get" name="removeLog"> ';
		html += '<span><input type="hidden" name="no" value="'+ req.query.no +'"></span><br>';
		html += '<span><input type="hidden" name="id" value="'+ req.query.count +'"></span><br>';
		html += '<input type="submit" name="removeLog" id="removeLog" value="re">';
		html += '</form>';
		//console.log(html);
	return html;
	//jsodomを使う予定
}

exports.removeImg = function (req) {
	console.log(req.query);
	var html = '<h3>カルテ削除確認</h3>';
		html += '<form action="/removeImg" method="get" name="karte"> ';
		html += '<span><input type="hidden" name="no" value="'+ req.query.no +'"></span><br>';
		html += '<span><input type="text" name="id" value="'+ req.query.id +'"></span><br>';
		html += '<input type="submit" name="remove" id="remove" value="&not;">';
		html += '<input type="reset" name="cancel" id="cancel" value="&times;">';
		html += '</form>';

	return html;
}

//データ解析フォーム　
exports.analytics = function (req) {
	var html = '';
		html += '<span id="rankingIcon"></span>';
		html += '<ul id="analyticsTab">';
		html += '<li id="visitLanking">来店数</li>';
		html += '<li id="nomineeCount">指名数</li>';
		html += '<li id="local">地域別</li>';//地図で色分け
		html += '<li id="generation">年齢別</li>';//年齢分布
		html += '<li id="relation">関係性</li>';
		html += '</ul>';
		html += '<input type="range" id="magnification" name="magnification" step="1" min="1" max="30" value="15">';
		//解析対象　来店頻度と年齢分布、　mongodb 
		html += '<div id="visual"></div>'
		html += '<span id="cancel">&times;</span>';
		html += '<div id="analyticsExplain"></div>'
	return html;
}