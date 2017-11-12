<template>
    <div id="technologiesContainer">
        <table class="table table-sm table-responsive-sm" id="technologiesTable" style="text-align: center;">
            <tbody>
            <tr class="noTopBorder">
                <th class="cellLeft">Technology</th><th class="cellRight">Price</th><th></th>
            </tr>
            <tr v-for="tech in technologies" v-if="tech.status !== 'hidden'" v-bind:key="tech.name + 'Row'">
                <td class="cellLeft">
                    <img v-bind:src="'ico/' + tech.image" style="height: 48px;"/>
                    <br>{{ camelToTitle(tech.name) }}
                </td>
                <td class="cellRight">
                    <resource-cost
                            v-bind:coster="tech"
                            v-bind:id="tech.name">
                    </resource-cost>
                </td>
                <td class="cellLeft">
                    <input type="button" class="btn btn-outline-secondary btn-sm"
                           v-bind:value="tech.discovered ? 'Discovered' : 'Discover'"
                           v-bind:disabled="tech.discovered || (tech.cost.amount > research.amount)"
                           v-on:click="makeDiscovery(tech.name)"/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import * as util from './util.js'
    import * as gameLogic from './game.js'

    export default {
        name: 'technology-table',
        props: ['technologies', 'research'],
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
            makeDiscovery: function(technologyName){
                this.$emit('makeDiscovery', technologyName);
            },
        }
    }
</script>