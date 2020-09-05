<template>
    <div>
        <b-container fluid>        
            <b-row class="mt-2">
                <b-col md="4">
                    <b-card title="Flight Tracking">
                        <b-row class="mt-4">
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-departure"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="Departure" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-arrival"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="Arrival" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Aircraft:</b-card-text>
                        <b-row>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="icaoCODE" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="numRegister" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Airline/Flight:</b-card-text>
                        <b-row>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="icaoCODE" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" placeholder="numFlight" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                    </b-card>
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
export default{
    created: function () {
        console.log('Created: ' + window.innerHeight);
    },
    mounted() {
        let mymap = L.map('mapid', {
            center: [51.505, -0.09],
            zoom: 13,
            closePopupOnClick: true
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(mymap);


        mymap.on('moveend', async function(ev) {
            let trackAPI = new service();
            let data = await trackAPI.getSedes();
            loadAircraft(data);

            loadInfoTracking();
            document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';
        });

        mymap.on('popupopen', function(ev) {
            console.log(ev);
        });

        function loadAircraft(data){
            let marker, latlon;
            data.forEach(element => {
                latlon = (element.cantEquipos).split(', ');
                marker = L.marker(latlon).addTo(mymap);
                marker.bindPopup( `<b>Avion: ${element.nameSede}</b>`);
            });
        }

        function loadInfoTracking(){
            console.log(mymap.getCenter());
        }

        this.updateView();
    },
    methods: {
        updateView () {
            console.log(window.innerWidth + ' / ' + window.innerHeight);
            document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';
        }
    },
    data (){
        return{
            msg: window.innerWidth,
            otherMsg: window.innerHeight
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