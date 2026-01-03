# WebAssembly with OpenCV Demo

This demo uses `@techstark/opencv-js` to process images in a Web Worker.

## Architecture

1.  **Vue App (`WebAssembly.vue`)**:
    -   Captures HTML DOM using `html2canvas`.
    -   Extracts pixel data (RGBA).
    -   Sends data to a Web Worker via `postMessage`.

2.  **Web Worker (`public/workers/cv-worker.js`)**:
    -   Imports `opencv.js` (WebAssembly/Standard).
    -   Receives raw pixel data.
    -   Uses `cv.matFromImageData` to create an OpenCV Matrix.
    -   Converts to Grayscale (`cv.cvtColor`).
    -   Applies Edge Detection (`cv.Canny`).
    -   Converts back to RGBA.
    -   Returns processed buffer.

3.  **OpenCV.js**:
    -   Located at `public/workers/opencv.js`.
    -   Copied from `node_modules/@techstark/opencv-js` during setup.

## Development

If you update `opencv-js` or want to use a custom build:
1.  Install the package: `pnpm install @techstark/opencv-js`
2.  Copy the file:
    ```bash
    cp node_modules/@techstark/opencv-js/dist/opencv.js public/workers/opencv.js
    ```

## Custom C++ Compilation (Optional)

If you still want to compile your own C++ code (`src/cpp/main.cpp`), follow the instructions in `src/cpp/compile.bat` and replace `opencv.js` with your own bindings.
