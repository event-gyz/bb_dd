/*!
 * vue-number-input v0.1.1
 * (c) 2016 yaojaa
 * Released under the MIT License.
 */

(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['vue'], factory);
	} else if (typeof exports === 'object') {
		factory(require('vue'));
	} else {
		factory(Vue);
	}
}(function(Vue) {

	Vue.component('yao-number-input', {
		props: {
			'step':{
				type:Number,
				default:1
			},
			'width':{
				type:Number,
				default:80
			},
			rule:{
					default: function () {
			        return {  }
			      }
			},
		
			'count': {
				default: 0,
				required: true,
				type: [String, Number],
				coerce: function(val) {
					return isNaN(val) ? 0 : val;
				}

			}
		},

		template: '<div class="vue-input-number" :style="{width:width+\'px\'}"><div class="vue-input-number-handler-wrap"><a v-on:click="add(1)" unselectable="unselectable" class="vue-input-number-handler vue-input-number-handler-up "><span unselectable="unselectable" class="vue-input-number-handler-up-inner"></span></a><a v-on:click="add(-1)" unselectable="unselectable" class="vue-input-number-handler vue-input-number-handler-down" ><span unselectable="unselectable" class="vue-input-number-handler-down-inner"></span></a></div><div class="vue-input-number-input-wrap"><input class="vue-input-number-input" :step="step"  min="1" max="4" autocomplete="off" v-model="count">{{is_min}}</div></div>',
		methods: {
			add: function(num) {
				console.log(this.step);

				this.count = parseInt(this.count);
				isNaN(this.count) ? this.count = 0 : this.count;

				if(num>0){
				this.count += this.step
				}else{
				this.count -= this.step
				}


				if (this.count <= 0 && num < 0) {
					this.count = 0;
					return
				}

			}
		}

	})

}));