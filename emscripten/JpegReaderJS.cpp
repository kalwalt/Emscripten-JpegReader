#include <stdio.h>
#include <string>
#include <vector>
#include "JpegReader/Jreader.h"
//#include "JpegReader/utils.h"
#include <AR/ar.h>
#include <AR2/config.h>
#include <AR2/util.h>
#include <emscripten.h>

extern "C" {
    enum {
    E_NO_ERROR = 0,
    E_BAD_PARAMETER = 64,
    E_INPUT_DATA_ERROR = 65,
    E_USER_INPUT_CANCELLED = 66,
    E_BACKGROUND_OPERATION_UNSUPPORTED = 69,
    E_DATA_PROCESSING_ERROR = 70,
    E_UNABLE_TO_DETACH_FROM_CONTROLLING_TERMINAL = 71,
    E_GENERIC_ERROR = 255
    };

    static char                 exitcode = -1;
    #define EXIT(c) {exitcode=c;exit(c);}

    int addJpeg(const char *filename) {
        char *ext;
        char buf[256];
        char buf1[512], buf2[512];
        JpegImageT *jpegImage;
        printf("%s\n", (char*)filename);
        if (!filename) return (E_BAD_PARAMETER);
         ext = arUtilGetFileExtensionFromPath(filename, 1);
        if (!ext) {
            std::cout << "Error: unable to determine extension of file '%s'. Exiting.\n" << filename << std::endl;
            EXIT(E_INPUT_DATA_ERROR);
        }
        if (strcmp(ext, "jpeg") == 0 || strcmp(ext, "jpg") == 0 || strcmp(ext, "jpe") == 0) {
            std::cout << "Reading JPEG file...\n" << std::endl;
            ar2UtilDivideExt( filename, buf1, buf2 );
            jpegImage = ar2ReadJpegImage( buf1, buf2 );
            if( jpegImage == NULL ) {
            std::cout << "Error: unable to read JPEG image from file '%s'. Exiting.\n" <<  filename << std::endl;
            EXIT(E_INPUT_DATA_ERROR);
        }
        std::cout <<"   Done.\n" << std::endl;
        printf("%s\n", (char*)filename);
        }
    }

    void readJpeg(std::string filename) {
        printf("%s\n", filename.c_str());
        addJpeg(filename.c_str());
    }
}

#include "bindings.cpp"