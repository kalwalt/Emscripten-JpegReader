# Emscripten-JpegReader

A simple project to read Jpeg files thanks to Emscripten. very useful if you want to start with the libjpeg library included in [Emscripten](https://emscripten.org/).

## Example to test

Go to examples folder and try in a localhost server the **load_jpeg_example.html** example. You will see in the console some messages displaying basic information about the jpeg image: 
- Number of channels
- Size of the image
- DPI
  
## Coding
JpegReader is based on [WebARKitLib](https://github.com/WebARKitLib) a simplified version of the ARToolkit5 library. It is used in other projects like [ARnft](https://github.com/webarkit/ARnft) and [jsartoolkitNFT](https://github.com/webarkit/jsartoolkitNFT). 
JpegReader can be very useful to setup project if you want to use jpeglib with Emscripten. The code is developed with modern javscript ES6 and the webpack bundler.