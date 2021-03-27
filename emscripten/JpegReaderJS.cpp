#include <stdio.h>
#include <string>
#include <vector>
#include "JpegReader/Jreader.h"
#include "JpegReader/utils.h"
#include <emscripten.h>

extern "C" {
     void addJpeg(const char *filename) {
        JpegImageT *jpegImage;
        std::string ext;
        ext = "jpg";
        printf("%s", (char*)ext.c_str());
        printf("%s", (char*)filename);
        arUtilRemoveExt((char*)filename);
        std::cout << filename << std::endl;
        jpegImage = ar2ReadJpegImage(filename, ext.c_str());
        std::cout << "Reading the jpeg image!" << std::endl;  
    }

    void readJpeg(std::string filename) {
        addJpeg(filename.c_str());
    }
}

#include "bindings.cpp"