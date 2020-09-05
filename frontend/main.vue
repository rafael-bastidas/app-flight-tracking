<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <div class="container">
      <b-navbar-brand href="#">F-T</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{name: 'home'}">Home</b-nav-item>
          <b-nav-item :to="{name: 'find'}">Find</b-nav-item>
          <b-nav-item :to="{name: 'about'}">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
  
  <router-view></router-view>
  
</div>
</template>