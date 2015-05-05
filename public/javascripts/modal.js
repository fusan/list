//カルテ追記
$(function() {
	console.log('引き渡しデータ' + no);

	//来店履歴追記
	$('#newKarte').on('click', function() {
		var appendKarte = $.ajax({
			url: '/appendKarte',
			type: 'GET',
			data: {
				no : no,
				}
			});

		//更新情報フォーム生成
		appendKarte.done(function(data) {
			console.log('レスポンスデータ')
			console.log(data);
			
			$('#modal').fadeIn();
			$('#modalInner').append(data);

			//キャンセル
			$('#cancel').on('click', function(e) {
				e.preventDefault();
				$('#modal').fadeOut();
				$('#modalInner').children().remove();
			});

			//追記情報格納
			$('#save').on('click', function(e) {
				console.log('click');
				//e.preventDefault();
				$('#modal').fadeOut();
				$('#modalInner').children().remove();
			});
		});
	});

	//画像取り込み >> fielapi 参考http://www.hcn.zaq.ne.jp/___/WEB/File_API-ja.html, https://app.codegrid.net/entry/file-api-filereader-api
	var inputFile = document.getElementById('file');
	var reader = new FileReader();
	var imgURL;
	 
	function fileChange(ev) {
	  var target = ev.target;
	  var file = target.files[0];
	  var type = file.type;
	  var size = file.size / 1024;

	  imgURL = file.name;
	  console.log(parseInt(size) + 'KB');
	  
	  if ( type !== 'image/jpeg' && size < 100) {
	    alert('選択できるファイルはJPEG画像だけです。');
	    inputFile.value = '';
	    return;
	  }
	  reader.readAsDataURL(file);
	}
	 
	function fileLoad() {
		//クライアントで即時表示
		//var img = '<img src="'+reader.result+'">';
		//$('#kartes').html(img);
		console.log(imgURL);
		console.log(reader);
		
		var appendIMG = $.ajax({
			url: '/appendIMG',
			type: 'post',
			data: {
				img: reader.result,
				no: no}
		});
		
		appendIMG.done(function(data) {
			
			console.log(data);
			$('#kartes').html(data);
		})
		
	}
	 
	inputFile.addEventListener('change', fileChange, false);
	reader.addEventListener('load', fileLoad, false);

});