~function($){
  /**
   * @params type : classic|horizontal|vertical|horizontal_t|vertical_t|fade
   * @param option
   */
  $.fn.x_slider = function(){
    var theme = {},
      params = {},
      option = typeof arguments[0]=='object'?arguments[0]:arguments[1]||{},
      type = typeof arguments[0]=='string'?arguments[0]:arguments[1]||'classic'

    theme['default'] = {
      prev:'prev',
      next:'next',
      cur:'cur',
      dot:'li',//selector
      item:'li',//selector
      auto:true,
      space:7000,
      period:400
    }
    theme['horizontal'] = theme['classic'] = {
      prev:'prev_h',
      next:'next_h',
      goal:'left',
      value:$('.x_list li img').width(),
      reflect:slide
    }
    theme['fade'] = {
      prev:'prev_a',
      next:'next_a',
      reflect:fading
    }
    theme['vertical'] = {
      prev:'prev_v',
      next:'next_v',
      goal:'top',
      value:$('.x_list li img').height(),
      reflect:slide
    }
    theme['horizontal_t'] = {}
    theme['vertical_t'] = {}
    $.extend(theme['horizontal_t'],theme['horizontal']);
    $.extend(theme['vertical_t'],theme['vertical']);
    theme['horizontal_t']['reflect'] = onlist;
    theme['vertical_t']['reflect'] = onlist;
    function onlist(index,d_class){
      if(d_class=='')return
      rock_lock = true;
      list.addClass(d_class);
      list.on('webkitAnimationEnd',function(){
        rock_lock = false;
        list.removeClass(d_class);
        setClass();
        roll_index = index_next;
      })
    };
    $.extend(params,theme['default'],option,theme[type]);
    var me = $(this[0]),
      prev = me.find('.x_prev'),
      next = me.find('.x_next'),
      list = me.find('.x_list'),
      dots = me.find('.x_dots'),
      dot = dots.find(params.dot),
      item = list.find(params.item),
      len = item.length,

      roll_index = 0,
      roll_interval,

      index_cur = 0,
      index_prev = 0,
      index_next = 0,
      rock_lock = false

    function setClass(){
      if(rock_lock)return
      index_cur = dot.index(dots.find('.'+params.cur));
      index_prev = (index_cur - 1 + len) % len;
      index_next = (index_cur + 1) % len;
      list.find('.' + params.cur).removeClass(params.cur);
      list.find('.' + params.prev).removeClass(params.prev);
      list.find('.' + params.next).removeClass(params.next);
      item.eq(index_cur).addClass(params.cur);
      item.eq(index_prev).addClass(params.prev);
      item.eq(index_next).addClass(params.next);
    }
    setClass();
    function slide(index,d_class,direction){
      rock_lock = true;
      var animation = {}
      animation[params.goal] = params['value'] * direction;
      list.animate(animation,params.period,function(){
        rock_lock = false;
        setClass();
        roll_index = index_next;
        var css_obj = {}
        css_obj[params.goal] = 0;
        list.css(css_obj);
      });
    }
    function fading(index){
      rock_lock = true;
      item.eq(index_cur).fadeOut(params.period,function(){
        $(this).removeClass('cur');
      });
      item.eq(index).fadeIn(params.period,function(){
        rock_lock = false;
        setClass();
        roll_index = index_next;
        $(this).addClass('cur');
      });
    }

    function rock(index){
      if(rock_lock)return
      var direction = 0,
      d_class = ''
      if(index > index_cur){
        direction = -1;
        d_class = params.next;
      }
      if(index < index_cur){
        direction = 1;
        d_class = params.prev;
      }
      dots.find('.' + params.cur).removeClass(params.cur);
      dot.eq(index).addClass(params.cur);
      list.find('.' + params.prev).removeClass(params.prev);
      list.find('.' + params.next).removeClass(params.next);
      item.eq(index).addClass(d_class);
      params.reflect.call(null,index,d_class,direction);
    }
    dot.on('click',function(){
      var me = $(this),
      index = dot.index(me)
      rock(index);
    })
    $('.x_prev').on('click',function(){
      setClass();
      rock(index_prev);
    })
    $('.x_next').on('click',function(){
      setClass();
      rock(index_next);
    })

    function roll(){
      rock(roll_index%len);
      roll_interval = setTimeout(roll,params['space']);
    }
    if(params.auto){
      roll();
      me.on({
        mouseenter:function(){
          clearTimeout(roll_interval);
        },
        mouseleave:function(){
          roll_interval = setTimeout(roll,params['space']);
        }
      })
    }
  }
}(jQuery);