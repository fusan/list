$(function() {
  var today = new Date();
  var birthDay = new Date(birthday);

  if(sex == '女性') $('.headline').css({color: 'rgba(243, 12, 5, 0.6)'});
  
  //来店リストとカルテ画像リストのリアルタイム更新
  $(window).on('load', function() {
    shopLog(no);
    karteLog(no);
    memoLog(no);
  });


  //カルテ画像表示
  function karteLog(no) {
    var kartes = $.ajax({
      url: '/kartes',
      type: 'GET',
      data: {no: no}
    });

    kartes.done(function(data) {
      var imgCounts = $(data).filter('img').length;
      
      $('#kartes').html(data);

      //カルテ画像削除
      $('#kartes > img').on('click', function() {
        //console.log('clicked');
        console.log($(this).attr('alt'));
        console.log(no);
        karteRemove($(this).attr('alt'),no);
      });
    });

    kartes.fail(function(err) {
      console.log(err);
    });
  }

  //カルテ削除
  function karteRemove(id,no) {
    var remove = $.ajax({
      url: '/removeKarteForm',
      type: 'GET',
      data: {
        id: id,
        no: no
      }
    });

    remove.done(function(data) {
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
      $('#remove').on('click', function(e) {
        $('#modal').fadeOut();
        $('#modalInner').children().remove();
      });
    })
  }

  //来店履歴表示
  function shopLog(no) {
    var logs = $.ajax({
      url: '/log',
      type: 'GET',
      data: {no: no}
    });

    //過去ログ取得
    logs.done(function(data) {
      var listCounts = $(data).length;
      var lastVisit = $(data).eq(listCounts - 1).children().eq(1).text();
      var age = getAge(birthDay,today);
          age = parseInt(age);

      //基本情報更新
      $('#log').html(data);//document.getElementById('log').innerHTML = data;
      $('#age').html(age);//document.getElementById('age').html = age; 
      $('#visitCount').html(listCounts);//document.getElementById('visitCount').innerHTML = listCounts; 
      $('#lastVisit').html(lastVisit);//document.getElementById('lastVisit').innerHTML = lastVisit; 

      //来店履歴訂正　-> modifyKarete
      $('.logList').on({
        'mouseenter': function() {
          $(this).css({ background: 'rgba(0,0,0,.16)'});
        },
        'mouseleave': function() {
          $(this).css({ background: 'rgba(0,0,0,.04)'});
        },
        'click': function() {
          console.log($(this).find('.logId').text());
          logModfy(this);
        }
      });
    });
  }

  //来店履歴修正
  function logModfy(selector) {
    var modifyLog = $.ajax({
            url: '/modifyKarte',
            get: 'GET',
            data: {
              no: no,
              count: $(selector).find('span').eq(0).text()
            }
          });

          modifyLog.done(function(data) {
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
              $('#modal').fadeOut();
              $('#modalInner').children().remove();
            });

            //削除
            $('#removeLog').on('click', function() {
              var id = $('input[name="id"]').val();
              var no = $('input[name="no"]').val();
              logRemove(id,no);
              $('#modal').fadeOut();
              $('#modalInner').children().remove();
            })
          });
  }

  //メモデータのデータベース格納と再表示
  function memoLog(no) {
    console.log('memoを読み込む');

    //データベースに照会をリクエスト
    var memos = $.ajax({
      url: '/memos',
      type: 'GET',
      data: {
        no: no
      }
    });

    //データベースからのレスポンスを反映
    memos.done(function(data) {
      //console.log(data[0]['メモ']);
      $('#memos').html(data[0]['メモ']);
    });
  }

  //メモデータの追記
  $('#writeMemo').on('click', function() {
    var oldMemo = $('#memos').html() + '<br>';
    var newMemo = window.prompt('コメントしてね', oldMemo);

    var memo = $.ajax({
      url: '/appendMemo',
      type: 'GET',
      data: {
        no : no,
        memo: newMemo
      }
    });

    memo.done(function(data) {
      //alert('追記');//追記完了
      $('#memos').html(data.memo);
      console.log(data);
    });

    memo.fail(function(err) {
      console.log(err);
    });
  });

  var helps = [];
  helps[0] = '<ul>来店履歴の使い方<li>『＋』で新規追加</li><li>リストを直接クリックで訂正処理</li></ul>';
  helps[1] = '<ul>カルテ画像の使い方<li>『＋』で新規追加</li></ul>';
  helps[2] = 'メモ帳の使い方';
  helpToolTip('.question',helps);

  //ヘルプ
  function helpToolTip(selector,helps) {
    $(selector).on('click', function() {
      if(!$('#help')[0]) {
          $(this).parent().append('<div id="help">');

          $('#help').html(helps[$(selector).index(this)]).css({
              overflow: 'scroll',
              position: 'absolute',
              top: $(this).offset().top - 90,
              left: $(this).offset().left - 300,
              padding: '.2rem',
              width: '300px',
              height: '100px',
              background: 'rgba(255,255,250,.32)',
              'box-shadow': '0 0 1px rgba(0,0,0,1)',
              opacity: 0
          }).animate({
              top: $(this).offset().top - 110,
              left: $(this).offset().left -300,
              opacity: 1
          });
        } else {
          $('#help').animate({
            opacity:0
          },300,function() {
            $('#help').remove();
          });
        }
    });
  }

  //技術開発コメント
  explain('#writeMemo','memo.html() => prompt value => ajax => db.update => res.send => memo.html()');
  explain('#file','fileApi  => ajax => db.save => db.find() => res.send => img.html()');

  //説明のツールチップ
  function explain(selector, text) {
    $(selector).on({
      'mouseenter': function() {
        this.parent = $(this).parent();
        this.top = $(this).offset().top;
        this.left = $(this).offset().left + $(this).width();
        this.caution = $('<p id="caution">' + text + '</p>');

        this.parent.append(this.caution);

        this.caution.css({
              position: 'absolute',
              top: this.top - $(this).parent().height(),
              left: this.left - $(this).width(),
              padding: '0 .4rem',
              background: 'white',
              'font-size': '12px',
              'color': 'red',
              'box-shadow': '0 0 1px gray',
              opacity: 0
          }).animate({
              top: this.top - this.parent.height() * 2,
              opacity: 1
          },300);
      },
      'mouseleave': function() {
        this.caution.fadeOut(900);

        setTimeout(function() {
            this.caution.remove();
        },930);
      }
    });
  }

  //年齢計算
  function getAge (birthday, now) {
    var b = new Date(birthday.getTime());
    var n = new Date(now.getTime());
    return (n-b)/ (365 * 24 * 60 * 60 *1000) - (n >= b ? 0: 1);
  }
});