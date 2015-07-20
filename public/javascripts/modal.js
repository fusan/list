//カルテ追記
$(function() {
	//参考　Fielapi 参考http://www.hcn.zaq.ne.jp/___/WEB/File_API-ja.html, https://app.codegrid.net/entry/file-api-filereader-api
	var inputFile = document.getElementById('file');
	console.log('引き渡しデータ', no);

	//来店履歴追記
	document.getElementById('newKarte').addEventListener('click', function() {
		var appendKarte = $.ajax({
			url: '/appendKarte',
			type: 'GET',
			data: {
				no : no,
				}
			});

		//更新情報フォーム生成
		appendKarte.done(function(data) {
			console.log('レスポンスデータ', data);
			
			$('#modal').fadeIn();
			$('#modalInner').append(data);

			//キャンセル
			document.getElementById('cancel').addEventListener('click', function(e) {
				e.preventDefault();
				$('#modal').fadeOut();
				$('#modalInner').children().remove();
			},false);

			//追記情報格納
			document.getElementById('save').addEventListener('click', function(e) {
				console.log('click');
				//e.preventDefault();
				$('#modal').fadeOut();
				$('#modalInner').children().remove();
			},false);
		});
	},false);

	//画像取り込み

	var reader = new FileReader();

	inputFile.addEventListener('change', fileChange, false);
	reader.addEventListener('load', fileLoad, false);
	 
	function fileChange(ev) {
	  var target = ev.target;
	  var file = target.files[0];
	  var type = file.type;
	  var size = file.size / 1024;

	  console.log('ファイル容量',parseInt(size) + 'KB');
	  
	  if ( type == 'image/*' && size < 100) {
	    alert('選択できるファイルはJPEG画像だけです。');
	    inputFile.value = '';
	    return;
	  }

	  reader.readAsDataURL(file);
	}
	 
	function fileLoad() {

		console.log(reader);
		
		var appendIMG = $.ajax({
			url: '/appendIMG',
			type: 'post',
			data: {
				img: reader.result,
				no: no}
		});
		
		appendIMG.done(function(data) {
			//console.log('画像データ',data);
			$('#kartes').html(data);
		});	
	}
});