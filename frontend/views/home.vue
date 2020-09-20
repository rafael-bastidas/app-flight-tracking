<template>
    <div>
        <b-container fluid>        
            <b-row class="mt-2">
                <b-col md="4">
                    <b-card title="Información de Vuelo">
                        <b-row class="mt-4 mb-2">
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-departure"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.departure" placeholder="Salida" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-arrival"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.arrival" placeholder="Llegada" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Tipo de avion / #Registro:</b-card-text>
                        <b-row class="mb-2">
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.aircraftCode" placeholder="Codigo ICAO" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.aircraftReg" placeholder="Num. de Registro" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Aerolinea / #Vuelo:</b-card-text>
                        <b-row>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.airline" placeholder="Codigo ICAO" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.numFlight" placeholder="Num. de vuelo" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-overlay
                        :show="busy"
                        rounded
                        opacity="0.6"
                        spinner-variant="primary"
                        >
                        <b-button v-if="visibleBtn" v-on:click="loadFollow" class="mt-4" type="button" variant="primary" block>Seguir Vuelo</b-button>
                    </b-overlay>
                </b-col>
                <b-col md="8" align-self="stretch">
                    <div id="mapid"></div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import service from '../service/trankingService';
import iconoMarker from '../image/marker-png.png';
import iconoMarker0 from '../image/marker0-png.png';
import iconoMarker1 from '../image/marker1-png.png';
import iconoMarker2 from '../image/marker2-png.png';
import iconoMarker3 from '../image/marker3-png.png';

export default{
    created(){
        this.$root.bus.$on('noUser', this.listenBus)
    },
    mounted() {
        this.initMap();
        this.updateView();
        this.checkUser();
    },
    methods: {
        async loadFollow(){
            this.busy = true;
            if (this.markerInfo.departure !== '' && this.markerInfo.arrival !== '' && this.markerInfo.airline !== '' && this.markerInfo.numFlight !== '') {
                let dataUser = {email: this.$root.userCurrent.email, info: {departure: this.markerInfo.departure, arrival: this.markerInfo.arrival, airline: this.markerInfo.airline, flight: this.markerInfo.numFlight}};
                let trackAPI = new service();
                await trackAPI.postDataUser(dataUser);
                this.$root.userCurrent.info[this.$root.userCurrent.info.length] = dataUser.info;
                this.busy = false;
            } else {
                alert('No se dispone de la informacón suficiente para identificar el vuelo.');
                this.busy = false;
            }
        },
        listenBus(newValue){
            if (newValue === 0){
                this.visibleBtn = false;
            }
        },
        checkUser(){
            if (this.$root.userCurrent !== ''){
                this.visibleBtn = true;
            }
        },
        initMap(){
            this.map = L.map('mapid', { center: [0, 0], zoom: 13 });
            this.titleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            this.titleLayer.addTo(this.map);

            this.map.locate({setView: true});

            this.listenerMap();
        },
        listenerMap(){
            var ref = this;
            this.map.on('locationfound', (ev) =>{
                //L.marker([ev.latitude, ev.longitude]).addTo(this.map);
                this.map.stopLocate();
            });

            this.map.on('moveend', async function(ev) {
                //Calculo del radio y transformación a KM
                let radio = ref.map.distance(ref.map.getCenter(), [ref.map.getBounds()._southWest.lat, ref.map.getBounds()._southWest.lng]);
                radio = (radio-(radio*0.4))/1000;

                //Solicitud de datos a: aviation-edge
                let trackAPI = new service();
                ref.dataFligth = await trackAPI.getFligth(ref.map.getCenter(), radio);
                typeof ref.dataFligth[0] !== 'undefined' ? ref.loadAircraft() : console.log('No hay vuelos cerca');

                ref.dataAirport = await trackAPI.getAirport(ref.map.getCenter(), radio);
                typeof ref.dataAirport[0] !== 'undefined' && radio < 80 ? ref.loadAirport() : console.log('No hay aeropuertos cerca o el zoom esta muy alejado');

                //Ajuste del Size del map
                document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';                
            });
        },
        loadAirport(){
            //this.dataAirport.forEach(element => {
            //    let markerAirport = L.marker([element.latitudeAirport, element.longitudeAirport], {title: 'Aeropuerto'}).addTo(this.map);
            //    markerAirport.bindPopup(`<b>${element.nameAirport}</b><br>Ciudad: ${element.codeIataCity}<br>Pais: ${element.nameCountry}`);
            //});
            this.markerAirport === null ? '' : this.markerAirport.clearLayers();
            let markers = [];
            this.dataAirport.forEach(element => {
                let marker = L.marker([element.latitudeAirport, element.longitudeAirport], {title: 'Aeropuerto'});
                marker.bindPopup(`<b>${element.nameAirport}</b><br>Ciudad: ${element.codeIataCity}<br>Pais: ${element.nameCountry}`);
                markers[markers.length] = marker;
            });
            this.markerAirport = L.layerGroup(markers).addTo(this.map);
        },
        loadAircraft(){
            var ref = this;
            let myIcon;
            let markers = [];
            this.markerAirplane === null ? '' : this.markerAirplane.clearLayers();
            this.dataFligth.forEach(element => {
                if (element.geography.direction >= 0 && element.geography.direction < 90) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker0, iconSize: [40, 40], iconAnchor: [20, 30] });
                } else if (element.geography.direction >= 90 && element.geography.direction < 180) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker1, iconSize: [40, 40], iconAnchor: [20, 30] });
                } else if (element.geography.direction >= 180 && element.geography.direction < 270) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker2, iconSize: [40, 40], iconAnchor: [20, 30] });
                } else if (element.geography.direction >= 270 && element.geography.direction < 360) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker3, iconSize: [40, 40], iconAnchor: [20, 30] });
                } else {
                   myIcon = new L.Icon({ iconUrl: iconoMarker, iconSize: [40, 40], iconAnchor: [20, 30] });
                }

                let marker = L.marker([element.geography.latitude, element.geography.longitude], {icon: myIcon, title: 'Avion'});
                marker.bindPopup(`<h3>${element.aircraft.icaoCode}</h3>`);
                marker.info = {
                    'departure': element.departure.iataCode,
                    'arrival': element.arrival.iataCode,
                    'aircraftCode': element.aircraft.icaoCode,
                    'aircraftReg': element.aircraft.regNumber,
                    'airline': element.airline.icaoCode,
                    'numFlight': element.flight.number
                };
                marker.on('click', ref.onClickMarker);
                markers[markers.length] = marker;
            });
            this.markerAirplane = L.layerGroup(markers).addTo(this.map);
        },
        onClickMarker(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();

            console.log(content);
            this.markerInfo = e.target.info;
            this.updateView();
        },
        updateView () {
            document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';
        }
    },
    data (){
        return{
            widthSceen: window.innerWidth,
            heigthScreen: window.innerHeight,
            map: null,
            titleLayer: null,
            dataFligth: null,
            dataAirport: null,
            markerInfo: {
                    'departure': '',
                    'arrival': '',
                    'aircraftCode': '',
                    'aircraftReg': '',
                    'airline': '',
                    'numFlight': ''
                },
            layer: '',
            visibleBtn: false,
            busy: false,
            markerAirport: null,
            markerAirplane: null
        }
    }
}
</script>
<style>
#mapid{
    width: 100%;
    height: 600px;
}
</style>