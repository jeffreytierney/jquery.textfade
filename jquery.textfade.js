(function($) {

  function fade(config, el, text) {
    var chars = {};
    var cur_chars = {};
    var to_drop = {};
    
    var text_len = text.length;
    el = $(el);
    var cur = el.find(".tf_inner");
    var space = " ";
    var character;
    
    if(!cur.length) {
      cur = $(document.createElement("div")).addClass("tf_inner").css({"position":"relative", "line-height":"inherit"}).html(el.html());
      el.html(cur);
    }
    
    var hasText = cur.find(".tf").length;
    
    var el_offsets = el.offset();
    
    if (!hasText) {
      var df = document.createDocumentFragment();
      var _text = cur.html();
      for(var i=0, len=_text.length; i<len; i++) {
        character = (_text[i] !== " " ? _text[i] : space);
        if(character === "&") {
          while(i<len && _text[i+1] !== ";") {
            character += _text[++i];
          }
          if(i<len && _text[i+1] === ";") {
            character += _text[++i];
          }
        }
        df.appendChild($(document.createElement("span")).html(character).addClass("tf").get(0));
      }
      cur.empty().append(df);
      
      var positions = [];
      cur.children().each(function(i, val) {
        var offset = $(val).offset();
        positions.push({"top":(offset.top-el_offsets.top),"left":(offset.left-el_offsets.left)})
      });
      cur.children().each(function(i, val) {
        $(val).css({"position":"absolute","top":positions[i].top,"left":positions[i].left})
      });
      
    }
    
    el.data("finished", 0);
    el.unbind("letter_finished");
    el.bind("letter_finished", function(e) {
      var fin = el.data("finished");
      fin++;
      el.data("finished", fin);
      if(fin >= text_len) {
        end(config, el, text);
      }
    })
    
    //return;
    
    
    var tempentry = $(document.createElement("div")).addClass("_textfadetempitem").css({"line-height":"inherit","position":"absolute","top":"0px","left":"0px","font-size":config.font_size,"z-index":"1","color":"transparent","width":config.width,"text-indent":(-1*config.indent)+"px"});
    for(var i=0, len=text.length; i<len; i++) {
      character = (text[i] !== " " ? text[i] : space);
      if(character === "&") {
        while(i<len && text[i+1] !== ";") {
          text_len--;
          character += text[++i];
        }
        if(i<len && text[i+1] === ";") {
          text_len--;
          character += text[++i];
        }
      }
      tempentry.append($(document.createElement("span")).html(character));
    }
    el.append(tempentry);
    
    tempentry.children().each(function(i, val) {
      character = $(val).html();
      if(val && character != space) {
        if(chars[character]) {
          chars[character].push($(val));
        }
        else {
          chars[character] = [];
          chars[character].push($(val));
        }
      }
      else if(character== space) {
        text_len--;
      }
    });
    
    var count = 0;
    $.each(chars, function(i, val) {
      count++;
    });
    
    
    //return;
    cur.children().each(function(i, val) {
      if(val) {
        character = $(val).html();
        if(character!= "") {
          if(cur_chars[character]) {
            cur_chars[character].push($(val));
          }
          else {
            cur_chars[character] = [];
            cur_chars[character].push($(val));
          }
        }
      }
    });
    
    var count = 0;
    $.each(cur_chars, function(i, val) {
      count++;
    });
    
    $.each(chars, function(i, val) {
      if(cur_chars[i]) {
        if(cur_chars[i].length > chars[i].length) {
          var len = chars[i].length;
          var len2 = cur_chars[i].length;
          for(var j=0; j<len; j++) {
            $(cur_chars[i][j]).animate({"left":($(chars[i][j]).offset().left+config.indent-el_offsets.left)+"px","top":($(chars[i][j]).offset().top-el_offsets.top)+"px"}, config.animation_speed, function() {el.trigger("letter_finished");});
            $(cur_chars[i][j]).data("used", true);
            $(chars[i][j]).data("used", true);
          }
          for(var j=len; j<len2; j++) {
            //$(document.body).append($(cur_chars[i][j]).html());
            $(cur_chars[i][j]).data("used", false);
            $(cur_chars[i][j]).remove();
          }
        }
        else if(cur_chars[i].length < chars[i].length) {
          var len = cur_chars[i].length;
          var len2 = chars[i].length;
          for(var j=0; j<len; j++) {
            $(cur_chars[i][j]).animate({"left":($(chars[i][j]).offset().left+config.indent-el_offsets.left)+"px","top":($(chars[i][j]).offset().top-el_offsets.top)+"px"}, config.animation_speed, function() {el.trigger("letter_finished");});
            $(cur_chars[i][j]).data("used", true);
            $(chars[i][j]).data("used", true);
          }
          for(var j=len; j<len2; j++) {
            cur.append($(chars[i][j]).clone(true).addClass("tf").css({"position":"absolute","top":($(chars[i][j]).offset().top-el_offsets.top)+"px","left":($(chars[i][j]).offset().left+config.indent-el_offsets.left)+"px"}).hide().fadeIn(config.fade_speed, function() {el.trigger("letter_finished");}));
            $(chars[i][j]).data("used", true);
          }
        }
        else {
          var len = chars[i].length;
          for(var j=0; j<len; j++) {
            $(cur_chars[i][j]).animate({"left":($(chars[i][j]).offset().left+config.indent-el_offsets.left)+"px","top":($(chars[i][j]).offset().top-el_offsets.top)+"px"}, config.animation_speed, function() {el.trigger("letter_finished");});
            $(cur_chars[i][j]).data("used", true);
            $(chars[i][j]).data("used", true);
          }
        }	
      }
      else {
        $.each(val, function(j, val2) {
          cur.append($(chars[i][j]).clone(true).addClass("tf").css({"position":"absolute","top":($(chars[i][j]).offset().top-el_offsets.top)+"px","left":($(chars[i][j]).offset().left+config.indent-el_offsets.left)+"px"}).hide().fadeIn(config.fade_speed, function() {el.trigger("letter_finished");}));
          $(chars[i][j]).data("used", true);
        });
      }
    });
    
    //return;
    
    $.each(cur_chars, function(i, val) {
      if(!chars[i]) {
        $.each(val, function(j, val2) {
          $(val2).remove();
        });
      }
      else {
        $.each(val, function(j, val2) {
          if(!$(val2).data("used")) {
            $(val2).remove();
          }
        });
      }
    });
    tempentry.remove();
  }

  function end(config, el, text) {
    //console.log("end");
    if(config.clear_on_end) {
      el.html(text);
    }
    if(config.on_end) {
      config.on_end.call(this);
    }
  }
  
  $.fn.textfade = function(text, settings) {
    var config = {
      indent: 0,
      animation_speed: 3000,
      fade_speed: 5000,
      clear_on_end: true
    };
    
    if (settings) $.extend(config, settings);
    
    this.each(function(i, val) {
      var el = $(val);
      
      
      
      var lh = el.css("line-height");
      if(lh !== "normal") {
        el.css("line-height", 1);
      }
      //el.css("word-break", "keep-all");
      //el.css("word-wrap", "break-word");
      
      config.font_size = el.css("fontSize");
      config.width = el.css("width");
      
      fade(config, el, text);
      
    });
    
    return this;
 
   };
 
 })(jQuery);
