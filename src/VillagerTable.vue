<template>
    <div id="villagersContainer">
        <table class="table table-hover" style="text-align: center;">
            <tbody>
            <tr class="noTopBorder">
                <th class="cellLeft">Villagers</th><th class="cellRight">Quantity</th><th></th>
            </tr>
            <tr v-for="job in jobs" v-if="job.status !== 'hidden'" v-bind:id="job.name + 'Row'">
                <td class="cellLeft">
                    <img v-bind:src="'ico/' + job.image" style="height: 48px;"/>
                    <br>{{ camelToTitle(job.name) }}
                </td>
                <td class="cellRight">{{job.amount}}</td>
                <td class="cellLeft">
                    <span v-if="job.name !== 'idlers'">
                        <input type="button" class="btn btn-outline-secondary btn-sm" value="+" v-bind:disabled="jobs.idlers.amount == 0" v-on:click="assignWorker(job.name)"/>
                        <input type="button" class="btn btn-outline-secondary btn-sm" value="-" v-bind:disabled="job.amount == 0" v-on:click="unAssignWorker(job.name)"/>
                    </span>
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
        name: 'villager-table',
        props: ['jobs'],
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
            assignWorker: function(jobName){
                this.$emit('assignWorker', jobName);
            },
            unAssignWorker: function(jobName){
                this.$emit('unAssignWorker', jobName);
            },
        }
    }
</script>