import Vue from 'vue'
let vueTJ = {}
let myFunc = null;

function myClick(el, binding) {
  console.log('myClick value', binding.value)
}

vueTJ.install = function (Vue) {
  Vue.directive('tongji', {
    pararms: ["tjMessage"],
    bind: function (el, binding) {
      console.log(myFunc)
      if (binding.modifiers.load) {
        console.log('bind', binding)
      }
    },
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, binding) {
      // 聚焦元素
      console.log('inserted', this)
      if (binding.arg === 'click')
        el.addEventListener('click', myFunc = () => {
          myClick(el, binding)
        })
    },
    unbind(el, binding) {
      console.log('---unbind---')
      console.log('myFunc', myFunc)
      el.removeEventListener('click', myFunc);
    }
  })


}

export default vueTJ;
