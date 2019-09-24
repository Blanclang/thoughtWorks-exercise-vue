/*
*  @描述：自定义指令
*  @作者：邱康松
*  @创建时间：2019/1/29
*/

import Vue from 'vue';

let hasAuth = function (code) {
  // 从缓存中取出权限资源
  let authList = localStorage.getItem('data') && JSON.parse(localStorage.getItem('data')).resources;
  // 通过checkCode方法查找按钮的code是否存在，如果存在说明有权限
  if (authList && authList.length > 0) {
    return checkCode(code,authList)
  }
  return false;
};
let checkCode = function (code,list) {
  let hasCode = false;
  (function f(code,list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].idCode === code) {
        hasCode = true;
        break;
      } else {
        if (list[i].children && list[i].children.length > 0) {
          f(code,list[i].children);
          if (hasCode) {
            break;
          }
        }
      }
    }
  })(code,list);
  return hasCode;
};

// 按钮权限指令
Vue.directive('has', {
  bind: function (el, binding, vnode) {
    if (!hasAuth(binding.value)) { //binding.value为指令传进来的按钮code
     /* el.setAttribute('disabled','disabled');
      el.setAttribute('title','你无使用权限');
      el.classList.add('is-disabled'); //给按钮添加elementUI的禁用样式*/
      el.style.display = 'none';
    }
  }
});

//表格下拉加载
Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    let beforeScrollTop = selectWrap.scrollTop;
    selectWrap.addEventListener('scroll', function() {
      if (beforeScrollTop === this.scrollTop) { //过滤横向滚动条的监听
        return false;
      }
      if (this.clientHeight + this.scrollTop === this.scrollHeight) {
        binding.value()
      }
    })
  }
});

//dialog弹窗可拖动
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;';
    dragDom.style.cssText += ';top:0px;';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else{
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;


      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left');
      let styT = sty(dragDom, 'top');

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if(styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
      }else {
        styL = +styL.replace(/\px/g, '');
        styT = +styT.replace(/\px/g, '');
      };

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -(minDragDomLeft);
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-(top) > minDragDomTop) {
          top = -(minDragDomTop);
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false
    }
  }
})

export default hasAuth;