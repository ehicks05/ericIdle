<template>
    <div id="resourcesContainer">
        <table class="table table-hover" style="text-align: center;">
            <tr>
                <th class="cellLeft">Resource</th><th class="cellRight">Quantity</th><th class="cellRight">Rate</th>
            </tr>
            <tr v-for="resource in resources" v-if="resource.status !== 'hidden'" v-bind:key="resource.name + 'Row'">
                <td class="cellLeft">
                    <img v-bind:src="'ico/' + resource.image" style="height: 48px;"/>
                    <br>{{ camelToTitle(resource.name) }}
                </td>
                <td class="cellRight">
                    <span v-bind:id="resource.name">{{myRound(resource.amount, 2)}}</span>
                    /
                    <span v-bind:id="resource.name + 'Limit'">{{resource.limit}}</span>
                </td>
                <td class="cellRight" v-bind:id="resource.name + 'Rate'">
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