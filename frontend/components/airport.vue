<template>
    <div>
        <b-container fluid>        
            <b-card title="Airport" class="text-center mb-4 mt-2">     
                <b-row class="mt-4">
                    <b-col md="12">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-map-marker-alt"></i>
                            </b-input-group-prepend>
                            <b-form-input type="text" placeholder="Departure" class="bg-light"></b-form-input>
                        </b-input-group>
                    </b-col>
                </b-row>
            </b-card>

            <b-card title="Arrival" class="mb-3">
            <b-table striped hover :items="itemsArrival" :fields="fieldsArrival"></b-table>
            </b-card>

            <b-card title="Departure">
            <b-table striped hover :items="itemsDeparture" :fields="fieldsDeparture"></b-table>
            </b-card>
        </b-container>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fieldsArrival: ['time', 'flight', 'From', 'aircraft', 'airline', 'status'],
        itemsArrival: [
          { isActive: true, From: 40, time: 'Dickerson', flight: 'Macdonald', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: false, From: 21, time: 'Larsen', flight: 'Shaw', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: false, From: 89, time: 'Geneva', flight: 'Wilson', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: true, From: 38, time: 'Jami', flight: 'Carney', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' }
        ],
        // Note `isActive` is left out and will not appear in the rendered table
        fieldsDeparture: ['time', 'flight', 'From', 'aircraft', 'airline', 'status'],
        itemsDeparture: [
          { isActive: true, From: 40, time: 'Dickerson', flight: 'Macdonald', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: false, From: 21, time: 'Larsen', flight: 'Shaw', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: false, From: 89, time: 'Geneva', flight: 'Wilson', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' },
          { isActive: true, From: 38, time: 'Jami', flight: 'Carney', aircraft: 'VCX5', airline: 'BOING-77', status: 'in-route' }
        ]
      }
    }
  }
</script>