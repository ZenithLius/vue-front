
// Web Worker for CV Processing using @techstark/opencv-js

importScripts('opencv.js');

function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
    if (cv.Mat) callbackFn(true);

    let timeSpentMs = 0;
    const interval = setInterval(() => {
        const limitReached = timeSpentMs > waitTimeMs;
        if (cv.Mat || limitReached) {
            clearInterval(interval);
            return callbackFn(!limitReached);
        } else {
            timeSpentMs += stepTimeMs;
        }
    }, stepTimeMs);
}

let isReady = false;

if (typeof cv === 'function' && !cv.Mat) {
    cv = cv();
}

if (typeof cv !== 'undefined') {
    if (cv.onRuntimeInitialized) {
        cv.onRuntimeInitialized = () => {
            console.log('[Worker] OpenCV.js Runtime Initialized');
            isReady = true;
            postMessage({ type: 'LOADED' });
        };
    } else {
        waitForOpencv((success) => {
            if (success) {
                console.log('[Worker] OpenCV.js Ready');
                isReady = true;
                postMessage({ type: 'LOADED' });
            } else {
                postMessage({ type: 'ERROR', error: 'OpenCV load timeout' });
            }
        });
    }
} else {
    console.error('[Worker] cv is NOT defined. Check opencv.js path.');
}


self.onmessage = function (e) {
    const { type, width, height, imageData, filterType, value } = e.data;

    if (type === 'PROCESS_IMAGE') {
        if (!isReady) {
            console.error('[Worker] OpenCV not ready');
            return;
        }

        try {
            let src = cv.matFromImageData({
                data: new Uint8ClampedArray(imageData),
                width: width,
                height: height
            });

            let dst = new cv.Mat();
            let temp = new cv.Mat();

            // Filter Logic
            switch (filterType) {
                case 'GRAY':
                    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
                    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0); // Convert back to RGBA for display
                    break;

                case 'CANNY':
                    cv.cvtColor(src, temp, cv.COLOR_RGBA2GRAY, 0);
                    cv.Canny(temp, dst, 50, 100, 3, false);
                    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
                    break;

                case 'BLUR':
                    let kSize = new cv.Size(15, 15);
                    cv.GaussianBlur(src, dst, kSize, 0, 0, cv.BORDER_DEFAULT);
                    break;

                case 'SHARPEN':
                    // Sharpen kernel
                    // [[-1,-1,-1], [-1,9,-1], [-1,-1,-1]]
                    let kernelData = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
                    let kernel = cv.matFromArray(3, 3, cv.CV_32FC1, kernelData);
                    cv.filter2D(src, dst, cv.CV_8U, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT);
                    kernel.delete();
                    break;

                case 'THRESHOLD':
                    cv.cvtColor(src, temp, cv.COLOR_RGBA2GRAY, 0);
                    cv.threshold(temp, dst, 128, 255, cv.THRESH_BINARY);
                    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
                    break;

                default:
                    // Default to pass-through if unknown
                    src.copyTo(dst);
                    break;
            }

            // Return Result
            // If the result is single channel (grayscale), ensure we convert back to RGBA before this?
            // (Handled in cases above)

            const resultData = new Uint8ClampedArray(dst.data);

            // Cleanup
            src.delete();
            dst.delete();
            temp.delete();

            postMessage({
                type: 'RESULT',
                width,
                height,
                data: resultData
            });

        } catch (err) {
            console.error('[Worker] Processing Error:', err);
            postMessage({ type: 'ERROR', error: err.toString() });
        }
    }
};
