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
        printf("%s\n", (char*)filename);
        arUtilRemoveExt((char*)filename);
        std::cout << "Filename now is: " << filename << std::endl;
        jpegImage = ar2ReadJpegImage(filename, ext.c_str());
        std::cout << "Reading the jpeg image!" << std::endl;  
    }

    void readJpeg(std::string filename) {
        printf("%s\n", filename.c_str());
        addJpeg(filename.c_str());
    }
}

#include "bindings.cpp"