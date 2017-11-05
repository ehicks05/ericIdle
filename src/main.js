import Vue from 'vue'

import ResourceCost from './ResourceCost.vue'
import App from './App.vue'

// Define a new component called resource-cost
Vue.component('resource-cost', ResourceCost);

const vm = new Vue({
    el: '#app',
    render: h => h(App)
});
