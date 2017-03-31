/* COPYRIGHT (c) 2017 Mathew Boyles */

(function(){
  var memory_game = {
    'n': function(n){
        var ret = Number(n) > 9 ? "" + String(n): "0" + String(n);
        return String(ret);
    },
    's': function(s){
        var rand, index = -1,
            length = s.length,
            result = Array(length);
        while (++index < length) {
            rand = Math.floor(Math.random() * (index + 1));
            result[index] = result[rand];
            result[rand] = s[index];
        }
        return result;
    },
    'decks': [],
    'rows': 4,
    'columns': 4,
    'load_decks': function(){
      console.log('<MEMORY>','LOAD DECKS','Creating decks...');
      $('#deck_select').html('');
      window.x7apex = 0;
      $('#game_difficulty > a').click(function(){
        console.log('<MEMORY>','DIFFICULTY',Number($(this).attr('data-difficulty')));
        $('#game_difficulty > a.btn-success').removeClass('btn-success').addClass('btn-danger');
        $(this).removeClass('btn-danger').addClass('btn-success');
        memory_game.mode = $(this).attr('data-difficulty');
      });
      $(this.decks).each(function(deck_id,deck_data){
        console.log('<MEMORY>','LOAD DECKS','Created "'+deck_data.name+'"');
        $con = $('<article><div class="flipper"><div class="flip-front"></div></div></article>');
        $con.find('.flip-front').css('background-image','url(assets/img/decks/'+deck_data.id+'/'+deck_data.id+'00.png)');
        $con.click(function(){
          console.log('<MEMORY>','SELECT DECK','"'+deck_data.name+'" selected');
          memory_game.start(deck_data);
        });
        $('#deck_select').append($con);
      });
      $('#random_deck').click(function(){
        console.log('<MEMORY>','SELECT DECK','#random selected');
        var random = Math.floor(Math.random()*$('#deck_select > article').length);
        $('#deck_select > article').eq(random).click();
      });
    },
    'start': function(deck){
      console.log('<MEMORY>','START GAME','Loading...');
      memory_game.deck = deck;
      memory_game.over = false;
      $('#loading_deck h1').text(deck.name);
      $('#loading_deck section').html('');
      $('#select').addClass('sm-hide').animate(
        {'top':'55%'},
        200,
        function(){
          $('#select').animate(
            {'top':'-200%'},
            250,
            function(){
              $('#loading_deck').fadeIn(function(){
                $(deck.cards).each(function(card_id,card_name){
                  $con = $('<article><div class="flipper"><div class="flip-front">&nbsp;</div><div class="flip-back">&nbsp;</div></div></article>');
                  $con.find('.flip-back').css('background-image','url(assets/img/decks/'+deck.id+'/'+deck.id+memory_game.n(card_id+1)+'.png)');
                  $con.find('.flip-front').css('background-image','url(assets/img/decks/'+deck.id+'/'+deck.id+'00.png)');
                  // $con.addClass('flipped');
                  $('#loading_deck section').append($con);
                  console.log('<MEMORY>','START GAME','Display card',deck.cards[card_id]);
                });
                setTimeout(function(){
                  memory_game.start_game();
                },2000);
              });
            }
          );
        }
      );
    },
    'start_game': function(){
      var deck = memory_game.deck;
      console.log('<MEMORY>','START GAME','Starting...');
      $('#deck_info .col-sm-10 h3').text(deck.name);
      $('#deck_info .col-sm-10 p').text(deck.caption);
      $('#field').html('');
      $('#loading_deck').animate(
        {'top':'55%'},
        200,
        function(){
          $('#loading_deck').animate(
            {'top':'-200%'},
            250,
            function(){
              $(this).hide();
              if(memory_game.timer) clearInterval(memory_game.timer);
              memory_game.timer = false;
              memory_game.time = 0;
              memory_game.flips = 0;
              window.x7apex = 0;
              $('#deck_info .col-sm-2 h1').text('0:00');
              $('#deck_info .col-sm-2 p').text('0 flips');
              memory_game.timer = setInterval(function(){
                memory_game.time = Number(memory_game.time)+1;
                var time_text_min = Math.floor(memory_game.time/60);
                var time_text_sec = memory_game.time-(time_text_min*60);
                $('#deck_info .col-sm-2 h1').text(time_text_min+':'+memory_game.n(time_text_sec));
              },1000);
              $('#play_area').fadeIn('slow',function(){
                memory_game.notification = new NotificationFx({
                  message: '<div class="ns-thumb"><img src="assets/img/alert/star.png"/></div><div class="ns-content"><p>Game started.</p></div>',
                  layout: 'other',
                  ttl: 5000,
                  effect: 'thumbslider',
                  type: 'notice'
                });
                memory_game.notification.show();
                console.log('<MEMORY>','START GAME','Game started');
              });
              $('#select').hide();
            }
          );
        }
      );
      var available_options = [];
      $(deck.cards).each(function(card_id,card_name){
        for(x=1;x<=memory_game.mode;x++){
          available_options.push(card_id);
          available_options.push(card_id);
        }
      });
      console.log('<MEMORY>','START GAME','Cards alocated');
      var new_id = 0;
      available_options = memory_game.s(available_options);
      available_options = memory_game.s(available_options);
      console.log('<MEMORY>','START GAME','Cards shuffled');
      $(available_options).each(function(card_id,card_name){
        console.log('<MEMORY>','START GAME','Card created',card_id);
        card_info = memory_game.deck.cards[card_name];
        card_name = memory_game.n(card_name+1);
        $con = $('<article><div class="flipper"><div class="flip-front">&nbsp;</div><div class="flip-back">&nbsp;</div></div></article>');
        $con.find('.flip-front').css('background-image','url(assets/img/decks/'+deck.id+'/'+deck.id+'00.png)');
        $con.data('data-card-image','url(assets/img/decks/'+deck.id+'/'+deck.id+card_name+'.png)');
        $con.data('data-card',card_name);
        $con.click(function(){
          console.log('<MEMORY>','CARD SELECT','Card selected',card_id);
          $(this).attr('data-card',$(this).data('data-card'));
          $(this).find('.flip-back').css('background-image',$(this).data('data-card-image'));
          if(($('#play_area article.won').length/2)>window.x7apex){
            $('#play_area').remove();
            console.log('<MEMORY>','CHEAT','Cheat detected',1);
            memory_game.notification = new NotificationFx({
              message: '<div class="ns-thumb"><img src="assets/img/alert/error.png"/></div><div class="ns-content"><p>Cheat detected.</p></div>',
              layout: 'other',
              ttl: 1000000,
              effect: 'thumbslider',
              onClose: function(){
                window.location.reload();
              },
              type: 'notice'
            });
            memory_game.notification.show();
          }else if($(this).hasClass('won')){
            console.log('<MEMORY>','CARD SELECT','Invalid selection [WON]',card_id);
          }else if(!memory_game.timer){
            $('#play_area').remove();
            console.log('<MEMORY>','CHEAT','Cheat detected',2);
            memory_game.notification = new NotificationFx({
              message: '<div class="ns-thumb"><img src="assets/img/alert/error.png"/></div><div class="ns-content"><p>Cheat detected.</p></div>',
              layout: 'other',
              ttl: 1000000,
              effect: 'thumbslider',
              onClose: function(){
                window.location.reload();
              },
              type: 'notice'
            });
            memory_game.notification.show();
          }else if($('#field > article.flipped').length < 2){
            console.log('<MEMORY>','CARD SELECT','Card flipped',card_id);
            $(this).addClass('flipped');
            if($('#field > article.flipped').length==2){
              memory_game.flips = Number(memory_game.flips)+1;
              $('#deck_info .col-sm-2 p').text(memory_game.flips+' flip'+(memory_game.flips==1?'':'s'));
              if($('#field > article.flipped[data-card="'+$(this).attr('data-card')+'"]').length==2){
                console.log('<MEMORY>','CARD SELECT','Card match (WON)',card_id);
                $('#field > article.flipped').removeClass('flipped').addClass('won');
                window.x7apex = Number(window.x7apex)+1;
              }else{
                setTimeout(function(){
                  setTimeout(function(el){
                    console.log('<MEMORY>','CARD SELECT','Cards destroyed');
                    el.attr('data-card','');
                    el.find('.flip-back').css('background-image','none');
                  },100,$('#field > article.flipped'));
                  $('#field > article.flipped').removeClass('flipped');
                },memory_game.speed);
              }
              if($('#field > article.won').length==$('#field > article').length){
                clearInterval(memory_game.timer);
                memory_game.timer = false;
                if(memory_game.flips < memory_game.mode*5){
                  $('#play_area').remove();
                  console.log('<MEMORY>','CHEAT','Cheat detected',3);
                  memory_game.notification = new NotificationFx({
                    message: '<div class="ns-thumb"><img src="assets/img/alert/error.png"/></div><div class="ns-content"><p>Cheat detected.</p></div>',
                    layout: 'other',
                    ttl: 1000000,
                    effect: 'thumbslider',
                    onClose: function(){
                      window.location.reload();
                    },
                    type: 'notice'
                  });
                  memory_game.notification.show();
                }else{
                  console.log('<MEMORY>','GAME OVER','Game won',memory_game.time,memory_game.flips);
                  memory_game.over = true;
                  $('#deck_info .col-sm-2 p').text('Done | '+memory_game.flips+' flips');
                  var time_text_min = Math.floor(memory_game.time/60);
                  var time_text_sec = memory_game.time-(time_text_min*60);
                  memory_game.notification = new NotificationFx({
                  	message: '<div class="ns-thumb"><img src="assets/img/alert/tick.png"/></div><div class="ns-content"><p>Game complete in '+time_text_min+'min '+time_text_sec+'sec using '+memory_game.flips+' flips.</p></div>',
                  	layout: 'other',
                  	ttl: 10000,
                  	effect: 'thumbslider',
                  	type: 'notice'
                  });
                  memory_game.notification.show();
                  memory_game.pause();
                }
              }
            }
          }
        });
        $('#field').append($con);
      });
      console.log('<MEMORY>','START GAME','Cards created');
    },
    'quit': function(){
      if(typeof(memory_game.notification.hide)=='function') memory_game.notification.hide();
      console.log('<MEMORY>','GAME OVER','Game quit');
      if(memory_game.timer) clearInterval(memory_game.timer);
      memory_game.timer = false;
      $('#play_area').fadeOut();
      $('#select').show().removeClass('sm-hide').animate({'top':'50%'},300);
      $('#loading_deck').hide().css({'top':'50%'});
      if($('#paused').is(':visible')){
        $('#paused > .paused-content').animate({'top':'-100%'},function(){
          $('#paused').hide();
        });
      }
    },
    'pause': function(){
      console.log('<MEMORY>','GAME PAUSE','Paused');
      if(memory_game.timer) clearInterval(memory_game.timer);
      memory_game.timer = false;
      $('#paused > .paused-content').removeClass('game-over').find('h2:first').text('Paused');
      if(memory_game.over) $('#paused > .paused-content').addClass('game-over').find('h2:first').text('Game Over');;
      $('#paused').show();
      $('#paused > .paused-content').css({'top':'-100%'}).animate({'top':'50%'},300);
    },
    'resume': function(){
      console.log('<MEMORY>','GAME PAUSE','Resumed');
      if(memory_game.timer) clearInterval(memory_game.timer);
        if(!memory_game.over){
        memory_game.timer = setInterval(function(){
          memory_game.time = Number(memory_game.time)+1;
          var time_text_min = Math.floor(memory_game.time/60);
          var time_text_sec = memory_game.time-(time_text_min*60);
          $('#deck_info .col-sm-2 h1').text(time_text_min+':'+memory_game.n(time_text_sec));
        },1000);
      }
      if($('#paused').is(':visible')){
        $('#paused > .paused-content').animate({'top':'-100%'},function(){
          $('#paused').hide();
        });
      }
    },
    'ready': function(){
      console.log('<MEMORY>','PAGE READY','Begin log',Date.now());
      window.onhashchange = function(){
        if(window.location.hash=='#bright' || window.location.hash=='bright') $('html').removeClass('dark');
        else $('html').addClass('dark');
      }
      window.onhashchange();
      console.log('<MEMORY>','PAGE BUILDER','Building...');

      $con = $('<div id="loading_deck"></div>');
      $con.append('<h5>Deck Selected</h5><h1></h1><hr />');
      $con.append('<section class="cards small-cards hover-cards inverted-cards text-center"></section>');
      $('body').append($con);
      console.log('<MEMORY>','PAGE BUILDER','Built #loading_deck');

      $con = $('<div id="select"></div>');
      $con.append('<h5>Memory</h5><h1>Difficulty</h1>');
      $con.append('<div id="game_difficulty"></div>');
      $con.find('#game_difficulty').append('<a class="btn btn-success" data-difficulty="1">Beginner (1 set)</a>');
      $con.find('#game_difficulty').append('<a class="btn btn-danger" data-difficulty="2">Easy (2 sets)</a>');
      $con.find('#game_difficulty').append('<a class="btn btn-danger" data-difficulty="3">Medium (3 sets)</a>');
      $con.find('#game_difficulty').append('<a class="btn btn-danger" data-difficulty="5">Hard (5 sets)</a>');
      $con.append('<h1>Select Deck</h1>');
      $con.append('<section class="cards" id="deck_select">Loading...</section><a class="btn btn-sm btn-danger" id="random_deck">Random</a><hr />');
      $con.append('<div class="small"><a href="#dark">Dark (Default)</a> | <a href="#bright">Bright</a><br />Made by Mathew Boyles.</div>');
      $('body').append($con);
      console.log('<MEMORY>','PAGE BUILDER','Built #select');

      $con = $('<div id="play_area"></div>');
      $con.append('<div id="deck_info" class="row"></div>');
      $con.find('#deck_info').append('<div id="pause_button"></div>');
      $con.find('#pause_button').append('<div>||</div>');
      $con.find('#pause_button').append('<button class="btn btn-danger">Pause</button>');
      $con.find('#deck_info').append('<div class="col-sm-10"><h3></h3><p></p></div>');
      $con.find('#deck_info').append('<div class="col-sm-2"><h1></h1><p></p></div>');
      $con.find('#pause_button').click(function(){
        memory_game.pause();
      });
      $con.append('<section class="cards" id="field"></section>');
      $('body').append($con);
      console.log('<MEMORY>','PAGE BUILDER','Built #play_area');

      $con = $('<div id="paused"></div>');
      $con.append('<div class="paused-content"></div>');
      $con.find('.paused-content').append('<h2>Paused</h2>');
      $con.find('.paused-content').append('<ul></ul>');
      $con.find('.paused-content > ul').append('<li>Resume</li>');
      $con.find('.paused-content > ul > li:last').click(function(){
        memory_game.resume();
      });
      $con.find('.paused-content > ul').append('<li>Quit game</li>');
      $con.find('.paused-content > ul > li:last').click(function(){
        memory_game.quit();
      });
      $con.find('.paused-content').append('<div><a href="#dark">Dark (Default)</a> | <a href="#bright">Bright</a><br />Made by Mathew Boyles.</div>');
      $con.append('<div class="backdrop"></div>');
      $('body').append($con);
      console.log('<MEMORY>','PAGE BUILDER','Built #paused');

      console.log('<MEMORY>','PAGE BUILDER','Building complete');
      console.log('<MEMORY>','LOAD DECKS','Connecting...');
      $.ajax({
        url: "assets/decks.json",
        cache: false,
        success: function(deck_data){
          console.log('<MEMORY>','LOAD DECKS','Successfully connected');
          localStorage['mbmemory_deckscache']=JSON.stringify(deck_data);
          memory_game.decks = deck_data;
          memory_game.load_decks();
          $('#loading').fadeOut();
        },
        error: function(){
          console.log('<MEMORY>','LOAD DECKS','Unable to connect');
          if(typeof(localStorage['mbmemory_deckscache'])=='string'){
            console.log('<MEMORY>','LOAD DECKS','Loaded from cache');
            memory_game.notification = new NotificationFx({
              message: '<div class="ns-thumb"><img src="assets/img/alert/info.png"/></div><div class="ns-content"><p>Unable to load decks from server. Loaded from cache.</p></div>',
              layout: 'other',
              ttl: 5000,
              effect: 'thumbslider',
              type: 'notice'
            });
            memory_game.notification.show();
            memory_game.decks = JSON.parse(localStorage['mbmemory_deckscache']);
            memory_game.load_decks();
          }else{
            console.log('<MEMORY>','LOAD DECKS','No decks available');
            memory_game.notification = new NotificationFx({
              message: '<div class="ns-thumb"><img src="assets/img/alert/error.png"/></div><div class="ns-content"><p>Unable to load decks from server. No cache available.</p></div>',
              layout: 'other',
              ttl: 1000000000,
              effect: 'thumbslider',
              type: 'notice'
            });
            memory_game.notification.show();
            $('#deck_select').html('<strong>ERROR</strong>: Unable to load decks. Please try again.');
          }
          $('#loading').fadeOut();
        }
      });
    },
    'notification': {
      'show': new Function,
      'hide': new Function
    },
    'speed': 500,
    'mode': 1,
    'timer': false,
    'time': 0,
    'flips': 0,
    'over': true
  };
  $(document).ready(function(){memory_game.ready();});
})();
