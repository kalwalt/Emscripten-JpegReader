#include <stdio.h>
#include <string>
#include <vector>
#include "JpegReader/Jreader.h"
#include <emscripten.h>

extern "C" {
     void addJpeg(const char *filename) {
        JpegImageT *jpegImage;
        std::string ext;
        ext = "jpg";
        jpegImage = ar2ReadJpegImage(filename, ext.c_str());
        std::cout << "Reading the jpeg image!" << std::endl;  
    }

    void readJpeg(std::string filename) {
        addJpeg(filename.c_str());
    }
}

#include "bindings.cpp"