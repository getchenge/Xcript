/**
 * a file of library
 * based on jquery
 */

(function($){
  //plugin of disable select
  $.fn.disableSelection = function() {
    return this
    .attr('unselectable', 'on')
    .css('user-select', 'none')
    .on('selectstart', false);
  };

  if(!window.JSON){//for ie7 json stringify
    function toJsonString(json_obj){
      var str = '{'
      for(var key in json_obj){
        str+=',"'+key+'":"'+json_obj[key]+'"';
      }
      str+='}';
      str = str.replace('{,','{');
      return str;
    }
    window.JSON = {};
    JSON.parse = $.parseJSON;
    JSON.stringify = toJsonString;
  }
  if(!window.console){//for ie test
    window.console = {};
    window.console.log = function(s){return s}
  }
  //before & after pseudo hack for ie7
  var after = $('[data-after]')
  , before = $('[data-before]')
  function fixStr(str){
    return escape(str).replace('%u','&#x').toLocaleLowerCase()+';';
  }
  before.each(function(){
    var me = $(this)
    , filler = $('<span class="hack-before"></span>').html(fixStr(me.attr('data-before')))
    me.prepend(filler);
  })
  after.each(function(){
    var me = $(this)
    , filler = $('<span class="hack-after"></span>').html(fixStr(me.attr('data-after')))
    me.append(filler);
  })

  //click hide
  $(document).on('click',function(e){
    $('._hide').each(function(){
      $(this).trigger('_hide', e.target);
    })
  })


  /**
   *
   * @param tpl
   * @param data
   * @return html string
   */
  function render(tpl,data){
    var i, pattern
    for(i in data){
      pattern = new RegExp('\\{\\{'+i+'\\}\\}','ig');
      tpl = tpl.replace(pattern,data[i])
    }
    return tpl;
  }

  /**
   *
   * @param els,a dom elements list
   */
  function fixScroll(els){
    [].slice.call(els).forEach(function(el){
      el.addEventListener('mousewheel',function(e){
        this.scrollTop -= e.wheelDeltaY;
        e.preventDefault()
      })
    });
  }

  /**
   *
   * @param str
   * @param tag
   * @param newTag
   * @returns {*}
   */
  function changeWrapTag(str,tag,newTag){
    var reg = new RegExp('(^<'+tag+')([\\s\\S]*>[\\s\\S]*)$<\\\/\\1>','i')
    str.replace(reg,function(str,tag,html){
      return '<'+newTag+html+'<\/'+newTag+'>';
    })
    return str
  }
})(jQuery);
