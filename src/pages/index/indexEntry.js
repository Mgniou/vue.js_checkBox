import Vue from 'vue';
import index from './index.vue';
require('./index.scss');

var vm = new Vue({
    el: '#app',
    components: {
        index
    }
});
window.vm = vm;