<template>
    <div class="resourceCost">
        {{cost}}
        <img v-bind:src="'ico/' + coster.cost.resource.image"/>
    </div>
</template>

<script>
    import * as gameLogic from './game.js'

    export default {
        name: 'resource-cost',
        props: ['coster'],
        data: function () {
            return {
                text: 'some-text'
            }
        },
        computed: {
            cost: function () {
                return gameLogic.getBuildingCost(this.coster);
            }
        }
    }
</script>

<style>
    img {height: 32px; vertical-align: middle;}
    .resourceCost {white-space:nowrap; background-color: transparent; text-align: right; padding-left:5px;}
</style>