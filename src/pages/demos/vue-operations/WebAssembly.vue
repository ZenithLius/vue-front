<template>
  <div class="wasm-demo-container">
    <div class="header-section">
      <h2 class="title">HTML图片处理</h2>
      <p class="subtitle">HTML 转换为图片 -> OpenCV (Wasm) -> 渲染 -> 保存图片</p>
    </div>

    <!-- Control Bar -->
    <div class="controls">
      <div class="control-group">
        <label>滤镜:</label>
        <div class="btn-group">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            :class="{ active: currentFilter === filter.id }"
            @click="setFilter(filter.id)"
          >
            {{ filter.name }}
          </button>
        </div>
      </div>
      
    <div class="control-group">
        <label>质量:</label>
        <div class="btn-group">
          <button 
            v-for="s in scales" 
            :key="s"
            :class="{ active: currentScale === s }"
            @click="setScale(s)"
          >
            {{ s }}x
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <label>显示:</label>
        <div class="btn-group">
          <button @click="viewMode = 'fit'" :class="{ active: viewMode === 'fit' }">FIT</button>
          <button @click="viewMode = 'original'" :class="{ active: viewMode === 'original' }">1:1</button>
        </div>
      </div>

      <div class="control-group">
         <button class="action-btn main-action" @click="handleProcess" :disabled="isProcessing">
          {{ isProcessing ? '处理中...' :'生成图片' }}
        </button>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Source Area -->
      <div class="panel source-panel">
        <div class="capture-area-wrapper">
            <div class="capture-area" id="capture-target" ref="captureTarget">
            <div class="card-demo">
                <div class="chart-mock">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 40%"></div>
                <div class="bar" style="height: 90%"></div>
                </div>
            </div>
            </div>
        </div>
      </div>

      <!-- Result Area -->
      <div class="panel result-panel">
        <div class="panel-header">
            图片（手动保存）
            <div class="panel-controls">
                <!-- Additional controls could go here -->
            </div>
        </div>
        <div class="canvas-container" :class="{ 'scrollable': viewMode === 'original' }">
          <!-- Canvas styles controlled by Vue class/style binding now -->
          <canvas ref="resultCanvas" :style="canvasStyle"></canvas>
          <div v-if="!hasResult && !isProcessing" class="placeholder">
            
          </div>
          <div v-if="isProcessing" class="loader">
            <div class="spinner"></div>
            Processing...
          </div>
        </div>
        <div class="stats" v-if="hasResult">
           <span>Op: {{ currentFilter }}</span> | <span>Res: {{ lastWidth }}x{{ lastHeight }}</span> | <span>Time: {{ processTime.toFixed(2) }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import html2canvas from 'html2canvas';

const captureTarget = ref<HTMLElement | null>(null);
const resultCanvas = ref<HTMLCanvasElement | null>(null);
const isProcessing = ref(false);
const hasResult = ref(false);
const processTime = ref(0);
const currentFilter = ref('SHARPEN');
const currentScale = ref(2); 
const lastWidth = ref(0);
const lastHeight = ref(0);
const showGlitch = ref(false);
const viewMode = ref<'fit' | 'original'>('fit');

const canvasStyle = computed(() => {
    if (viewMode.value === 'fit') {
        return { width: '100%', height: 'auto' };
    }
    return { width: 'auto', height: 'auto' };
});

const filters = [
    { id: 'SHARPEN', name: '锐化' },
    { id: 'GRAY', name: '灰度' },
    { id: 'CANNY', name: '边缘检测' },
    { id: 'BLUR', name: '模糊' },
    { id: 'THRESHOLD', name: '阈值' }
];

const scales = [1, 2, 3, 4, 8,16]; // Added 8x for extreme detail

let worker: Worker | null = null;
let workerReady = false;

// ... (Glitch Logic remains same)
const styleId = 'hide-scanlines-style';
const updateGlitchVisibility = (visible: boolean) => {
    let style = document.getElementById(styleId);
    if (!visible) {
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .scanlines { display: none !important; } 
                .pointer-events-none.absolute.inset-0.z-40.bg-\\[radial-gradient\\(circle_at_center\\,transparent_50\\%\\,rgba\\(0\\,0\\,0\\,0\\.4\\)_100\\%\\)\\] { display: none !important; }
                
                /* Force Flat / Clean Look for Capture */
                .card-demo, .bar {
                    box-shadow: none !important;
                    animation: none !important;
                }
                .box-glow, .text-glow {
                    box-shadow: none !important;
                    text-shadow: none !important;
                    animation: none !important;
                }
                .capture-area * {
                     animation: none !important;
                     transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        if (style) style.remove();
    }
}

const toggleGlitch = () => {
    showGlitch.value = !showGlitch.value;
    updateGlitchVisibility(showGlitch.value);
};

onMounted(() => {
  // Disable glitch/breathing effect by default
  updateGlitchVisibility(false);

  worker = new Worker('/workers/cv-worker.js');
  
  worker.onmessage = (e) => {
    const { type, data, width, height, error } = e.data;
    
    if (type === 'LOADED') {
      console.log('Worker Ready');
      workerReady = true;
    } else if (type === 'RESULT') {
      handleWorkerResult(data, width, height);
    } else if (type === 'ERROR') {
      console.error('Worker Error:', error);
      isProcessing.value = false;
      alert('Error: ' + error);
    }
  };
});

onBeforeUnmount(() => {
  if (worker) worker.terminate();
  updateGlitchVisibility(true);
});

const setFilter = (id: string) => {
    currentFilter.value = id;
};

const setScale = (s: number) => {
    currentScale.value = s;
};

const handleProcess = async () => {
  if (!captureTarget.value || !worker) return;
  if (!workerReady) {
      alert('Worker is loading OpenCV... please wait a moment.');
      return;
  }

  try {
    isProcessing.value = true;
    const startTime = performance.now();

    console.log('--- [Step 1] Processing Started ---');
    console.log('[Step 1] Filter:', currentFilter.value);
    console.log('[Step 1] Scale:', currentScale.value);

    const scale = currentScale.value;

    console.log('[Step 2] Calling html2canvas...');
    const canvas = await html2canvas(captureTarget.value, {
      scale: scale, 
      backgroundColor: null, 
      logging: false,
      useCORS: true
    });
    console.log('[Step 3] html2canvas finished. Canvas size:', canvas.width, 'x', canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    
    if (width === 0 || height === 0) {
        throw new Error('Capture failed: 0 dimensions');
    }

    console.log('[Step 4] Getting 2D Context');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    
    console.log('[Step 5] Getting ImageData');
    const imageData = ctx.getImageData(0, 0, width, height);

    console.log('[Step 6] Posting message to Worker');
    worker.postMessage({
      type: 'PROCESS_IMAGE',
      width,
      height,
      imageData: imageData.data,
      filterType: currentFilter.value
    });
    console.log('[Step 6] Message posted.');

    processTime.value = performance.now() - startTime; 

  } catch (err) {
    console.error(err);
    isProcessing.value = false;
    alert('Capture/Process Failed');
  }
};

const handleWorkerResult = (pixelData: Uint8Array, width: number, height: number) => {
  const render = () => {
    if (!resultCanvas.value) return;
    
    const canvas = resultCanvas.value;
    
    canvas.width = width;
    canvas.height = height;

    // Remove direct style manipulation here, rely on Vue binding
    // canvas.style.width = '100%'; 

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newImageData = new ImageData(
      new Uint8ClampedArray(pixelData),
      width,
      height
    );
    
    ctx.putImageData(newImageData, 0, 0);
    
    lastWidth.value = width;
    lastHeight.value = height;
    isProcessing.value = false;
    hasResult.value = true;
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(render);
  } else {
    setTimeout(render, 0);
  }
};
</script>

<style scoped>
.wasm-demo-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #121212;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

.header-section {
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
}

.title {
  font-size: 20px;
  color: #4fc3f7;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.subtitle {
  font-size: 12px;
  color: #666;
}

.controls {
    display: flex;
    gap: 30px;
    background: #1e1e1e;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    align-items: center;
    border: 1px solid #333;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 15px;
}

.control-group label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    font-weight: bold;
}

.btn-group {
    display: flex;
    background: #2a2a2a;
    border-radius: 4px;
    padding: 2px;
    gap: 2px;
}

.btn-group button {
    background: transparent;
    border: none;
    color: #aaa;
    padding: 8px 16px;
    font-size: 10px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.2s;
}

.btn-group button:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
}

.btn-group button.active {
    background: #4fc3f7;
    color: #000;
    font-weight: bold;
}

.action-btn.main-action {
    background: #4caf50;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    transition: background 0.2s;
}

.action-btn.main-action:hover:not(:disabled) {
    background: #66bb6a;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.action-btn:disabled {
    background: #333;
    color: #555;
    cursor: not-allowed;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.panel {
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  background: #252525;
  padding: 10px 15px;
  font-size: 11px;
  font-weight: bold;
  border-bottom: 1px solid #333;
  color: #666;
  letter-spacing: 1px;
}

.capture-area-wrapper, .canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212; /* Checkerboard pattern could be nice here */
  position: relative;
  overflow: auto;
  padding: 20px;
}

.card-demo {
  background: linear-gradient(135deg, #2a2a2a, #222);
  border: 1px solid #444;
  padding: 24px;
  width: 280px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  text-align: center;
  /* Ensure clean text rendering */
  -webkit-font-smoothing: antialiased;
}

.card-demo h3 {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.card-demo p {
  color: #666;
  font-size: 12px;
  margin-bottom: 20px;
}

.chart-mock {
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  gap: 10px;
}

.bar {
  flex: 1;
  background: #4fc3f7;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 0 10px rgba(79, 195, 247, 0.2);
}

.bar:nth-child(2) { background: #ffb74d; box-shadow: 0 0 10px rgba(255, 183, 77, 0.2); }
.bar:nth-child(3) { background: #81c784; }
.bar:nth-child(4) { background: #e57373; }

.info-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-top: 8px;
    border-bottom: 1px dashed #333;
    padding-bottom: 4px;
}

.canvas-container canvas {
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
    color: #444;
    font-size: 14px;
}

.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #4fc3f7;
    gap: 10px;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(79, 195, 247, 0.3);
    border-top-color: #4fc3f7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.stats {
    padding: 8px 12px;
    background: #1a1a1a;
    border-top: 1px solid #333;
    font-size: 10px;
    color: #666;
    display: flex;
    justify-content: space-between;
}


.panel-controls {
    float: right;
    display: flex;
    gap: 10px;
}

.canvas-container.scrollable {
    display: block; /* unlock flex center */
    overflow: auto;
}
</style>