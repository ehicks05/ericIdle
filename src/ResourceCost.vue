<template>
    <div style="white-space:nowrap;background-color: #EEE;">
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