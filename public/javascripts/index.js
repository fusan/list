$(function() {
  //参考　重複チェック　http://lealog.hateblo.jp/entry/2012/07/07/155004

  //分析 
  var chart = $('#analytics').attr('src', '/images/chart.svg');
  chart.css({
    float: 'right',
    margin: '0 .5rem 0 0'
  })
 
  //分析モーダルウィンドウ
  $('#analytics').on('click', function() {
    $('#registerWindow').animate({
            position: 'absolute',
            top: 0,
            height: $(window).height()
        },500,'easeOutQuart');
    
    var analytics = $.ajax({
        url: '/analytics',
        type: 'GET'
    });

    analytics.done(function(data) {
        //d3.jsでデータをオブジェクトを取得
        $('#registerWindowInner').html(data);

        $('#visitLanking').on('click', visitRnaking);
        $('#magnification').on('change', visitRnaking);
        $('#nomineeCount').on('click', nomineeCount);

        cancel();
    });
  });

//来店ランキング
function visitRnaking() {

  var ranking = $.ajax({
    url: '/visitLanking',
    type: 'GET'
  });

  ranking.done(function(data) {
    var ranks = [];
    for(var i=0,n=data.length;i<n;i++) {
      var rank = {};
      rank.no = data[i]['会員番号'];
      rank.name = data[i]['氏名'];
      rank.count = data[i]['来店回数'];
      ranks.push(rank);
    }

    barChart('#visual',ranks);
  });
}

function nomineeCount() {
  
    var nomineeCount = $.ajax({
      url: '/nomineeCount',
      type: 'GET'
    });

    nomineeCount.done(function(data) {
      console.log(data);
      var nomineeAll = []; //指名リスト
      var nominator = []; //指名者リストnominator
      var nomineeRanking = [];　//指名者と指名数のオブジェクト配列

      for(var i=0,n=data.length;i<n;i++) {
        nomineeAll.push(data[i]['担当']);
      }

      var staffs = unique(nomineeAll);
      console.log(staffs);

      for(var i=0,n=staffs.length;i<n;i++) {
        var staff = {};
            staff.name = staffs[i];
            staff.count = 0;
        for(var j=0,n2=nomineeAll.length;j<n2;j++) {
          if(staffs[i] == nomineeAll[j]) {
            staff.count += 1; 
          }
        }
        nomineeRanking.push(staff);
      }

      pieChart('#visual',nomineeRanking);
      //barChart('#visual',nomineeRanking);     
    });
}

//pie chart 
function pieChart(DOM, obj) {
  var graphArea = $(DOM)
  var textPositions = [];
  var nums = [];
  var names = [];
  var magnification = .7;
  var fontSize = '.72rem';
  
  obj = obj.sort(function(a,b) {
    return d3.descending(a.count, b.count);
  })
  console.log(obj);

  graphArea.children().remove();

  for(var key in obj) {
        var num = obj[key].count;
        var name = obj[key].name;
        nums.push(parseInt(num));
        names.push(name);
      }
  
  console.log(nums,names);

  var Pie = d3.select(DOM)
    .append('svg')
    .attr({
      height: graphArea.height(),
      width: graphArea.width(),
    })
    .append('g')
    .attr({
      transform: 'translate(' + graphArea.width()*.5 + ',' + graphArea.height()*.5 + ')'
    })

  var pie = d3.layout.pie()
    .value(function(d) {
      return d;
    })

  var arc = d3.svg.arc().innerRadius(50).outerRadius(100);
  var color = d3.scale.category10();

  console.log(pie(nums));

  Pie.selectAll('path')
    .data(pie(nums))
    .enter()
    .append('path')
    .attr({
      //d:arc,
      stroke: 'white',
      fill: function(d,i) {
        //console.log(color(i));
        return color(i);
      }
    })
    .transition()
    .duration(300)
    .ease('ease')
    .delay(function(d,i) {
      return 300 * i;
    })
    .attrTween('d', function(d,i) {
      var interpolate = d3.interpolate(
        {startAngle: d.startAngle, endAngle: d.startAngle},
        {startAngle: d.startAngle, endAngle: d.endAngle}
        );

      return function(t) {
          return arc(interpolate(t));
        }
      })

  Pie.selectAll('text')
    .data(pie(nums))
    .enter()
    .append('text')
    .attr({
      transform: function(d) {
        //console.log(arc.centroid(d));
        textPositions.push(arc.centroid(d));
        return  'translate(' + arc.centroid(d) +')';
      },
      'font-size': fontSize,
      'text-anchor': 'middle',
      fill: 'black'
    })
    .text(function(d) {
      return d.value;
    })


    Pie.selectAll('text2')
    .data(names)
    .enter()
    .append('text')
    .attr({
      transform: function(d,i) {
        //console.log(textPositions[i][0] + 20 );
        var x = textPositions[i][0] + 20;
        var y = textPositions[i][1];
        return  'translate(' + x +',' + y +  ')';
      },
      'font-size': fontSize,
      'text-anchor': 'middle',
      fill: 'black'
    })
    .text(function(d) {
      return d;
    })

    Pie.append('text')
      .attr({
        fill: 'black',
        'text-anchor': 'middle'
      })
      .text('total' + d3.sum(nums))//)
}

//バーチャート　D3
function barChart(DOM,obj) {//DOM : jQueryObj
  $(DOM).children().remove();
  var positionArr = [];
  var nums = [];
  var names = [];
  var magnification = $('#magnification').val();

  for(var key in obj) {
        var num = obj[key].count;
        var name = obj[key].name;
        nums.push(parseInt(num));
        names.push(name);
      }
      console.log(nums,names);

  var barHieght = $(DOM).height();
  var barWidth = 20;
  var color = d3.scale.category10();
  
  //d3
  var Bar = d3.select(DOM)
              .append('svg')
              .attr({
                height: $(DOM).height(),
                width: $(DOM).width()
              })
  //グラフ
  Bar.selectAll('rect')
    .data(nums)
    .enter()
    .append('rect')
    .attr({
      x:function(d, i) {
        
        return i * barWidth *1.2;
      },
      y:barHieght,
      width: barWidth,
      height: 0,
      transform: 'translate('+barWidth+',-20)'
    })
    .transition()
    .duration(400)
    .ease('bounce')
    .attr({
      x:function(d, i) {
        
        return i * barWidth *1.2;
      },
      y: function(d,i) {
        positionArr.push(barHieght - d * magnification);
        return barHieght - d * magnification;
      },
      width: barWidth,
      height: function(d,i) {
        return d * magnification;
      },
      fill: function(d,i) {
        return color(i);
      }
    })

  //名前
  Bar.selectAll('text')
    .data(names)
    .enter()
    .append('text')
    .attr({
      x: function(d,i) {
        return (i + 1 ) * barWidth *1.2;
      },
      y:function(d, i) {
        console.log(positionArr[i]);
        return positionArr[i] - barWidth * 1.2;　　//ここがポイント
      },
      fill: 'black',
      'font-size': 9,
      'writing-mode': "tb-rl",
      'glyph-orientation-vertical': 'auto',
      'glyph-orientation-vertical': '90',
      'text-anchor': 'end',
      //transform: 'translate(20,0)',
      transform: 'rotate(90deg)',
      transform: 'translate('+barWidth*.3+',0)'
    })
    .text(function(d){
      return d;
    })
    //来店数
    Bar.selectAll('text2')
    .data(nums)
    .enter()
    .append('text')
    .attr({
      x:function(d, i) {
        return i * barWidth *1.2;
      },
      y: barHieght,
      width: barWidth,
      'text-anchor': 'middle',
      transform: 'translate('+(barWidth*1.5) +',-21)'
    })
    .text(function(d) {
      return d;
    })
    .attr({
      fill: 'white'
    })
}

//新規登録
$('#register').on('click', function() {
    $('#registerWindow').animate({
        position: 'absolute',
        top: 0,
        height: $(window).height()
    },500,'easeOutQuart');

    var register = $.ajax({
        url: '/register',
        type: 'GET'
    });

  //新規登録モーダルウィンドウ
  register.done(function(data) {
      //ヴァリデーション
      var regTel = /\d{2,4}-\d{2,4}-\d{4}/;
      var regName = /[^\x01-\x7E\xA1-\xDF]/;
      var regMail = /^[a-zA-Z0-9][a-zA-Z0-9_¥.¥-]+?@[A-Za-z0-9_¥.¥-]+$/;
        
      $('#registerWindowInner').html(data.html);

      //バリデーション
      validation(regName,$('input[name="name"]'),'全角でね');
      validation(regName,$('input[name="ruby"]'),'全角でね');
      validation(regTel,$('input[name="tel"]'),'半角で-をいれてね');
      validation(regMail,$('input[name="eMail"]'),'正しくありません');

      signUpCheck(); //確認画面へ
      cancel(); //キャンセル

      //郵便番号入力アシストAOI
      $('input[name="postcode"]').on('keyup', function() {
        AjaxZip3.zip2addr(this,'','address','address');
    });
  });   
		//window.open('/register');
});

//登録確認画面
function signUpCheck() {
  $('#signUpCheck').on('click', function() {
    //console.log($('input[name="sex"]').prop('checked'));

    var signUpCheck = $.ajax({
      url: '/signUpCheck',
      type: 'POST',
      data: {
        no: $('input[name="no"]').val(),
        name: $('input[name="name"]').val(),
        ruby: $('input[name="ruby"]').val(),
        tel: $('input[name="tel"]').val(),
        sex: $('input[name="sex"]').prop('checked') ? '女性': '男性',　//とりあえず
        postcode: $('input[name="postcode"]').val(),
        address: $('input[name="address"]').val(),
        birthday: $('input[name="birthday"]').val(),
        eMail: $('input[name="eMail"]').val()
      }
  });

    signUpCheck.done(function(data) {

      var no = data.no,
        html =  data.html;
        //console.log(html);
      $('#registerWindowInner').html(html);

      DBinsert(no);

      cancel();
    });
  });
}

  //本登録処理　-> DBへ
  function DBinsert(no) {
    $('#create').on('click', function() {
      var create = $.ajax({
       url: '/' + no,
       type: 'GET',
       data: {
         no: $('input[name="no"]').val(),
         name: $('input[name="name"]').val(),
         ruby: $('input[name="ruby"]').val(),
         tel: $('input[name="tel"]').val(),
         sex: $('input[name="sex"]').val(),
         postcode: $('input[name="postcode"]').val(),
         address: $('input[name="address"]').val(),
         birthday: $('input[name="birthday"]').val(),
         eMail: $('input[name="eMail"]').val()
       }
     });

     create.done(function(data) {
       console.log(data);
     })

     $('#registerWindow').animate({
         top: '100%',
         height: 0
     },250,'easeOutQuart');

     $('#registerWindowInner').empty();

     window.open('/card' + no, 'dependent=yes');
  });
}

  //モーダルウィンドウキャンセル処理
  function cancel() {
    $('#cancel').on('click', function() {
        $('#registerWindow').animate({
            top: '100%',
            height: 0
        });
        $('#registerWindowInner').empty();
    });
  }
  
	$('#slider').on('change', function() {
		console.log($(this).val());
	})

	//全会員情報取得
	var allList = $.ajax({
			url: '/allList',
			type: 'GET'
		});

	allList.done(function(data) {
			memberList(data,'.list');
		});

	//設定画面
  var control = $('#control').attr('src','/images/control.svg');
  var panel = $('#controlPanel');
  control.css({
      float: 'right'
  });

  panel.css({
      position: 'absolute',
      top: -98,
      right:20
  });

  control.on({
      'click': function() {
        //console.log($('#controlPanel').css('height'));
        //console.log($('#controlPanel').offset().top);

          if(parseInt(panel.css('top')) == -98) {
              $(this).css({
                '-webkit-transform': 'rotate(90deg)',
                '-webkit-transition': 'all .5s cubic-bezier(0.215, -0.400, 0.685, 1.530) 0 '
              });
              panel.animate({
                top: 0
              },400,'easeOutQuart');
          } else {
              $(this).css({
                  '-webkit-transform': 'rotate(0deg)',
                  '-webkit-transition': 'all .5s cubic-bezier(0.215, -0.400, 0.685, 1.530) 0 '
                });
              panel.animate({
                top: -98
              },400,'easeOutQuart');
          }
      },
      'mouseenter': function() {
          control.animate({
              opacity: .8
          },200);
      },
      'mouseleave': function() {
          control.animate({
              opacity: 1
          },200);
      }
  });

  //天気予報
  var weather = $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp',
        type: 'get'
      });

  weather.done(function(data) {
    //console.log(data);
    var img = $('<img>').attr('src','http://openweathermap.org/img/w/'+ data.weather[0].icon+'.png' );
          /*img.css({
            position: 'absolute',
            top: $('h1').offset().top,
            left: '90%'
          })*/
        //console.log(img);
    $('#weather').html(img);
  });

  //誕生日リスト
  var birthday = $.ajax({
      url: '/birthday',
      typ: 'GET'
    });

  birthday.done(function(data) {
    //console.log(new Date(data[0].birthday).getMonth());
    var lucker = $('<ul>').attr('class', 'lucker');
    var list = [];
        for(var i=0,n=data.length;i<n;i++) {
            var li = $('<li>').append(data[i].name + '　' + data[i].birthday);
            lucker.append(li);
        }
    $('#birthday').append(lucker);
  });
	
	//No.検索
	$('#searchNo').on('click', function() { //#NoNum => change event 
		var no = document.getElementById('NoNum').value;
		no = toInt(no);

		isNaN(no) ? alert('未登録です。') : window.open('/card' + no);
    //console.log('会員番号でサーチ: ' + no);
	});

	//名前検索
	$('#nameText').on('keyup', function() {　//#nameText => change event 
		var ruby = document.getElementById('nameText').value;
		console.log('会員名でサーチ: ' + ruby);

		//if(ruby == '') {
		//	alert('入力してください。');
		//} else {
			var search = $.ajax({
				url: '/search',
				type: 'GET',
				data: {
					ruby: ruby
				}
			});

			search.done(function(data) {
				memberList(data,'.list');
			});

			search.fail(function(err) {
				console.log(err);
			});
		//}
	});

	/*外部データ読み込み
	$('#inport').on('click', function() {
		console.log('click');

		var list = $.ajax({
			url: '/inport',
			type: 'GET'
		});

		list.done(function(data) {
			//var name = data['氏名'];
			alert('データベスに挿入完了');
			//console.log(data);
		});

	});*/

	function memberList(data,target) {
		var list = '';
    for(var i=0,n=data.length; i<n; i++) {
      var name = data[i]['氏名'], tel = data[i]['電話番号'], no = data[i]['会員番号'], sex = data[i]['性別'];
      list += '<div class="list"><span>'+no+'</span><span>'+ sex + '</span><span>'+name+'</span><span>TEL:'+tel+'</span></div>'
    } 
    //console.log(list);
    $('#searchResult').html(list);
    //検索結果にマウスエフェクト
    $(target).on({
        'mouseenter': function() {
          this.self = $(this);
            this.self.css({
              background: 'rgba(215, 223, 203, 0.24)',
              'box-shadow': 'black'
            });
        },
        'mouseleave': function() {
            //console.log('leave');
            this.self.css({
                background: 'rgba(215, 223, 203, 0.17)'
            });
        },
        'click': function() {
          var no = this.self.find('span').eq(0).text();
          var reg = /\d+/;
          no = no.match(reg)[0];
          no = parseInt(no);
          console.log(no);
          window.open('/card' + no);
        }
    });
  }

  //インプットルールチップ
  tooltip('#NoNum', '半角');
  tooltip('#nameText', '全角ひらがな');
  tooltip('input[name="ruby"]', '全角');

  function tooltip(selecter, text) { //selecter : #Num .Class
    $(selecter).on({
        'change':function () {
            var str = $(this).val();
            console.log(toInt(str));
            },
        'focus': function() {
            this.top = $(this).offset().top;
            this.left = $(this).offset().left + $(this).width();
            $(this).parent().append('<p id="caution">' + text + '</p>');
            $('#caution').css({
                position: 'absolute',
                top: this.top - $(this).parent().height(),
                left: this.left - $(this).width(),
                padding: '0 .4rem',
                'font-size': '12px',
                'color': 'red',
                background: 'white',
                'box-shadow': '0 0 1px gray',
                opacity: 0
            }).animate({
                top: this.top - $(this).parent().height() * 2,
                opacity: 1
            },300);
        },
        'blur': function() {
            $('#caution').fadeOut(900);
            setTimeout(function() {
               $('#caution').remove(); 
            },930);
        }
    });   
  }

//ヴァリデーション
function validation(reg,input,cautionText) {
    input.on('keyup', function() {
      if(reg.test(input.val())) {
        $(this).next().text('OK!');　//入力値をリアルで反映するならinput.val()
        //console.log('true');
      } else {
        $(this).next().text(cautionText);
        //console.log(cautionText);
      }
    });
  }

//オブジェクトのソート
function sort(arr,key) {//obj: 対象オブジェクト配列, count: ソートプロパティ
  arr.sort(function(a, b) {
        return (a.key > b.key) ? -1 : 1;
    });
}

//重複削除
function unique(array) {
　var storage = {};
　var uniqueArray = [];
　var i,value;
　for ( i=0; i<array.length; i++) {
   　value = array[i];
      if (!(value in storage)) {
      　storage[value] = true;
         uniqueArray.push(value);
       }
   }
   return uniqueArray;
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
  }
});