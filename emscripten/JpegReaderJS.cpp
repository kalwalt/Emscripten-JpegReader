#include "JpegReader/Jreader.h"
#include <cstdlib>
#include <stdio.h>
#include <string>
#include <vector>
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

static char exitcode = -1;
#define EXIT(c)                                                                \
  {                                                                            \
    exitcode = c;                                                              \
    exit(c);                                                                   \
  }

int addJpeg(const char *filename) {
  char *ext;
  char buf1[512], buf2[512];
  
  JpegImageT *jpegImage;
  
  if (!filename)
    return (E_BAD_PARAMETER);
  ext = arUtilGetFileExtensionFromPath(filename, 1);
  if (!ext) {
    std::cout << "Error: unable to determine extension of file '%s'. Exiting.\n"
              << filename << std::endl;
    EXIT(E_INPUT_DATA_ERROR);
  }
  if (strcmp(ext, "jpeg") == 0 || strcmp(ext, "jpg") == 0 ||
      strcmp(ext, "jpe") == 0) {
    std::cout << "Reading JPEG file...\n" << std::endl;
    ar2UtilDivideExt(filename, buf1, buf2);
    jpegImage = ar2ReadJpegImage(buf1, buf2);
    if (jpegImage == NULL) {
      std::cout << "Error: unable to read JPEG image from file '%s'. Exiting.\n"
                << filename << std::endl;
      EXIT(E_INPUT_DATA_ERROR);
    }
    ARLOGi("   Done.\n");
 
    if (jpegImage->nc != 1 && jpegImage->nc != 3) {
      ARLOGe("Error: Input JPEG image is in neither RGB nor grayscale format. "
             "%d bytes/pixel %sformat is unsupported. Exiting.\n",
             jpegImage->nc, (jpegImage->nc == 4 ? "(possibly CMYK) " : ""));
      EXIT(E_INPUT_DATA_ERROR);
    }
    ARLOGi("JPEG image number of channels: '%d'\n", jpegImage->nc);
    ARLOGi("JPEG image '%s' is %dx%d.\n", filename, jpegImage->xsize,
           jpegImage->ysize);
    ARLOGi("JPEG image, dpi is: '%d'\n", jpegImage->dpi);

    if (jpegImage->dpi == 0.0f) {
      
        printf("JPEG image '%s' does not contain embedded resolution data, and "
               "no resolution specified on command-line.\n",
               filename);
      
    }

  } else {
    ARLOGe("Error: file '%s' has extension '%s', which is not supported for "
           "reading. Exiting.\n",
           filename, ext);
    free(ext);
    EXIT(E_INPUT_DATA_ERROR);
  }
  free(ext);
  free(jpegImage);
  return 0;
}

int readJpeg(std::string filename) {
  ARLOGi("Filename is: '%s'\n", filename.c_str());
  addJpeg(filename.c_str());
  return 0;
}
}

#include "bindings.cpp"