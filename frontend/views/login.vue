<template>
<div class="d-flex align-items-center justify-content-center bg-dark Any">
    <b-card
    title="Ingresar"
    style="max-width: 20rem;"
    class="mb-2"
  >
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Correo Electronico:"
        label-for="input-1">

        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Ingrese su Correo"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Contraseña" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          required
          placeholder="Ingrese su contraseña"
        ></b-form-input>
      </b-form-group>

      <b-link :to="{name: 'register'}">Registrarse aqui</b-link>

      <b-overlay
        :show="busy"
        rounded
        opacity="0.6"
        spinner-variant="primary"
      >
      <b-button class="mt-4" type="submit" variant="primary" block>Ingresar</b-button>
      </b-overlay>
    </b-form>

  </b-card>
</div>
</template>

<script>
import service from '../service/trankingService';
import router from '../routes/router';

  export default {
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        show: true,
        busy: false
      }
    },
    methods: {
      async onSubmit(evt) {
        evt.preventDefault();
        this.busy = true;
        let serviceUser = new service();
        let response = await serviceUser.getUsuarios(this.form.email);
        if (response.length > 0) {
            if (response[0].password === this.form.password) {
                this.$root.bus.$emit('user', response[0]);
                this.$root.userCurrent = response[0];
                console.log('Usuario logueado', response[0].name);
                router.push('/');
            } else {
                alert('Usuario/Contraseña errada');
            }
        } else {
            alert('Usuario no registrado');
        }
        this.busy = false;
      }
    }
  }
</script>

<style>
.Any{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>