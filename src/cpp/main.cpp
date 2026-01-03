#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <vector>

using namespace emscripten;
using namespace cv;

// Helper to access raw memory
uint8_t* memory_get_offset(size_t size) {
    return new uint8_t[size];
}

// Memory cleanup
void memory_free(uint8_t* ptr) {
    delete[] ptr;
}

// Image processing function
val process_image(uintptr_t imgDataPtr, int width, int height) {
    // 1. Wrap the JS memory buffer in a cv::Mat. 
    // CV_8UC4 because typical ImageData from canvas is RGBA
    uint8_t* data = reinterpret_cast<uint8_t*>(imgDataPtr);
    Mat src(height, width, CV_8UC4, data);

    // 2. Convert to Grayscale
    Mat gray, edges;
    cvtColor(src, gray, COLOR_RGBA2GRAY);

    // 3. Apply Canny Edge Detection
    // Thresholds can be adjusted
    Canny(gray, edges, 100, 200);

    // 4. Convert back to RGBA for display
    Mat dest;
    cvtColor(edges, dest, COLOR_GRAY2RGBA);

    // 5. Copy data back to the original buffer or a return new one?
    // Start simple: Write back to the source buffer if sizes match.
    // src and dest are both 8UC4, so size matches.
    // We can copy dest.data back to src.data (which is the input pointer)
    memcpy(data, dest.data, width * height * 4);

    // Return true for success
    return val(true);
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("memory_get_offset", &memory_get_offset, allow_raw_pointers());
    function("memory_free", &memory_free, allow_raw_pointers());
    function("process_image", &process_image, allow_raw_pointers());
}
