<template>
    <div>
        <b-button-group class="d-flex">
        <b-button v-on:click="loadFlight()" :class="classA" class="w-50" squared>Itinerario de Vuelos</b-button>
        <b-button v-on:click="loadAirport()" :class="classB" class="w-50" squared>Itinerario de Aeropuertos</b-button>
        </b-button-group>

        <div v-if="switchForA">
            <flightVue></flightVue>
        </div>
        <div v-else>
            <airportVue></airportVue>
        </div>        
    </div>
</template>

<script>
import airportVue from '../components/airport.vue'
import flightVue from '../components/flight.vue'
export default {
    mounted(){

    },
    components: {
        airportVue, 
        flightVue
    },
    data() {
        return {
            switchForA: true,
            classA: 'text-primary',
            classB: ''
        }
    },
    methods: {
        loadFlight(){
            this.switchForA = true;
            this.classA = 'text-primary';
            this.classB = '';
        },
        loadAirport(){
            this.switchForA = false,
            this.classA = '';
            this.classB = 'text-primary';
        }
    }
}
</script>