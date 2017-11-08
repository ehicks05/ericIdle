<template>
    <div id="buildingsContainer">
        <table class="table table-hover" style="text-align: center;">
            <tbody>
            <tr class="noTopBorder">
                <th class="cellLeft">Structure</th><th class="cellRight">Quantity</th><th class="cellRight" style="width: 90px;">Price</th><th></th>
            </tr>
            <tr v-for="building in buildings" v-if="building.status !== 'hidden'" v-bind:id="building.name + 'Row'">
                <td class="cellLeft">
                    <a tabindex="0" data-html="true" data-toggle="popover"
                       :data-title="getBuildingPopoverTitle(building)"
                       :data-content="getBuildingPopoverContent(building)" data-trigger="hover">
                        <img v-bind:src="'ico/' + building.image" style="height: 48px;"/>
                    </a>
                    <br>{{ camelToTitle(building.name) }}
                </td>
                <td class="cellRight">{{building.amount}}</td>
                <td class="cellRight">
                    <resource-cost
                            v-bind:coster="building"
                            v-bind:id="building.name">
                    </resource-cost>
                </td>
                <td class="cellLeft">
                    <input type="button" class="btn btn-outline-secondary btn-sm"
                           value="Build" v-bind:disabled="building.cost.amount > building.cost.resource.amount" v-on:click="buildBuilding(building.name)"/>
                    <input type="button" class="btn btn-outline-secondary btn-sm"
                           value="Reclaim" v-bind:disabled="building.amount == 0" v-on:click="reclaimBuilding(building.name)"/>
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
        name: 'building-table',
        props: ['buildings'],
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
            buildBuilding: function(buildingName){
                this.$emit('buildBuilding', buildingName);
            },
            reclaimBuilding: function(buildingName){
                this.$emit('reclaimBuilding', buildingName)
            },
            getBuildingPopoverTitle: function(building){
                return '<div style="font-weight: bold;">' + util.camelToTitle(building.name) + '</div>';
            },
            getBuildingPopoverContent: function(building){
                let content = '';
                if (building.bonus.length > 0)
                {
                    content += '<table class="table table-hover"><tr><td colspan="2">Production Bonuses</td></tr><tr><td>Resource</td><td>Amount</td></tr>';
                    building.bonus.forEach(function (bonus)
                    {
                        content += '<tr><td>' + bonus.resource.name + '</td><td>+' + (bonus.amount * 100) + '%</td></tr>';
                    });
                    content += '</table>';
                }

                if (building.resourceLimitModifier.length > 0)
                {
                    content += '<table class="table table-hover"><tr><td colspan="3">Resource Limit Mods</td></tr><tr><td>Resource</td><td>Amount</td><td>Type</td></tr>';
                    building.resourceLimitModifier.forEach(function (limitModifier)
                    {
                        content += '<tr><td>' + limitModifier.resource.name + '</td><td>' + limitModifier.amount + '</td><td>' + limitModifier.type + '</td></tr>';
                    });
                    content += '</table>';
                }

                return content;
            },
        }
    }
</script>