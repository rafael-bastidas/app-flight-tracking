<template>
    <div>
        <b-container fluid>        
            <b-card title="Flight" class="text-center mb-4 mt-2">     
                <b-row class="mt-4">
                    <b-col md="6">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-plane-departure"></i>
                            </b-input-group-prepend>
                            <b-form-input type="text" placeholder="Departure" class="bg-light"></b-form-input>
                        </b-input-group>
                    </b-col>
                    <b-col md="6">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-plane-arrival"></i>
                            </b-input-group-prepend>
                            <b-form-input type="text" placeholder="Arrival" class="bg-light"></b-form-input>
                        </b-input-group>
                    </b-col>
                </b-row>
            </b-card>

            <b-card title="Information Flight" class="mb-3">
            <b-table striped hover :items="items" :fields="fields"></b-table>
            </b-card>
        
        </b-container>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fields: ['num_flight', 'airline', 'hrs_in', 'hrs_out'],
        items: [
          { isActive: true, num_flight: 40, hrs_in: 'Dickerson', hrs_out: 'Macdonald', airline: 'BOING-77' },
          { isActive: false, num_flight: 21, hrs_in: 'Larsen', hrs_out: 'Shaw', airline: 'BOING-77' },
          { isActive: false, num_flight: 89, hrs_in: 'Geneva', hrs_out: 'Wilson', airline: 'BOING-77' },
          { isActive: true, num_flight: 38, hrs_in: 'Jami', hrs_out: 'Carney', airline: 'BOING-77' }
        ]
      }
    }
  }
</script>

