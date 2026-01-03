<template>
  <h1>Opencv</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import cv from "@techstark/opencv-js";
 
cv.onRuntimeInitialized = () => {
  console.log("OpenCV.js is ready!");
  console.log(cv.getBuildInformation());
  // 在此处使用 OpenCV 函数
};

</script>
