

<template>
  <h1>You did it!!!!!!!!!</h1>
  <ul>
    <li v-for="item in user" :key="item.id">{{ item.name }}</li>
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
