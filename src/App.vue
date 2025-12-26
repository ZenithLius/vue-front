

<template>
  <h1>You did 233333  it!!!!!111!!222!!3333343466663</h1>
  <ul>
    <li v-for="item in user" :key="item.id">{{ item.name }}{{ item.id }}</li>
  </ul>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
const user=ref([])
const req=()=>{
   axios.get('http://localhost:3000/api/user').then(
    (res)=>{
      user.value=res.data
    }
)
}
req()
</script>
<style scoped></style>
