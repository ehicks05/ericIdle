<template>
    <div id="resourcesContainer">
        <table class="table table-sm table-responsive-sm">
            <tr>
                <th class="text-left">Resource</th><th class="text-right">Quantity</th><th class="text-right">Rate</th>
            </tr>
            <tr v-for="resource in resources" v-if="resource.status !== 'hidden'" v-bind:key="resource.name + 'Row'">
                <td class="text-left">
                    <img v-bind:src="'ico/' + resource.image" style="height: 32px;"/>
                    {{ camelToTitle(resource.name) }}
                </td>
                <td class="text-right">
                    <span v-bind:id="resource.name">{{myRound(resource.amount, 2)}}</span>
                    /
                    <span v-bind:id="resource.name + 'Limit'">{{resource.limit}}</span>
                </td>
                <td class="text-right" v-bind:id="resource.name + 'Rate'">
                    <button class="btn btn-outline-primary btn-sm" v-if="resource.name === 'food'" v-on:click="harvestFood">Harvest</button>
                    {{resource.rate}}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import * as util from './util.js'
    import * as gameLogic from './game.js'

    export default {
        name: 'resource-table',
        props: ['resources'],
        data: function () {
            return {
                text: 'some-text'
            }
        },
        methods: {
            camelToTitle: function (value) {
                const result = value.replace(/([A-Z])/g, " $1");
                return result.charAt(0).toUpperCase() + result.slice(1);
            },
            myRound: function(value, places) {
                const multiplier = Math.pow(10, places);
                return (Math.round(value * multiplier) / multiplier);
            },
            harvestFood: function() {
                this.$emit('harvestFood');
            }
        }
    }
</script>