<template>
    <div class="resourceCost">
        {{coster.cost.amount}}
        <img v-bind:src="'ico/' + coster.cost.resource.image"/>
    </div>
</template>

<script>
    export default {
        name: 'resource-cost',
        props: ['coster'],
        data: function () {
            return {
                text: 'some-text'
            }
        }
    }
</script>

<style>
    img {height: 32px; vertical-align: middle;}
    .resourceCost {white-space:nowrap; background-color: transparent; text-align: right; padding-left:5px;}
</style>