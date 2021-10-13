import ModuleLoader from './ModuleLoader'
import Utils from './Utils'

export default class JpegReader {

  // construction
  constructor () {
    // reference to WASM module
    this.instance
    this.jpegCount = 0
    this.version = '0.0.1'
    console.info('JpegReader ', this.version)
  }

  // ---------------------------------------------------------------------------

  // initialization
  async init () {
    const runtime = await ModuleLoader.init()
    this.instance = runtime.instance
    this._decorate()
    const scope = (typeof window !== 'undefined') ? window : global
    scope.JpegReader = this

    return this
  }

  _decorate () {
    // add delegate methods
    [
      'readJpeg',
      'FS'
    ].forEach(method => {
      this[method] = this.instance[method]
    })

  }

  // ----------------------------------------------------------------------------

  // public accessors
  async loadJpeg (urlOrData) {
    const targetPrefix = '/load_jpeg_' + this.jpegCount++

    let data
    let ext = 'jpg'
    const fullUrl = urlOrData + '.' + ext
    const target = targetPrefix + '.' + ext

    if (urlOrData instanceof Uint8Array) {
      // assume preloaded camera params
      data = urlOrData
      
    } else {
      // fetch data via HTTP
      try { data = await Utils.fetchRemoteData(urlOrData) } catch (error) { throw error }
    }

    this._storeDataFile(data, target)

    // return the internal marker ID
    return this.instance.readJpeg(target)
  }

  loadFile(url) {
    this.instance.readJpeg(url)
  }

  async loadJpegFile(res, url) {
    const target = '/trackable_' + this.jpegCount++
    try {
      let data = await this._ajax(res, url, target)
      //this._storeDataFile(data, target) // this is the same as self.FS.writeFile(target, byteArray, { encoding: 'binary' })
      await this.instance.readJpeg(url)
      return data
    } catch (e) {
      console.log("Error in the loadJpegFile: ", e)
    return e
    }
  }

  async _ajax (that, url, target) {
    let self = that
    return new Promise((resolve, reject) => {
      const oReq = new window.XMLHttpRequest()
      oReq.open('GET', url, true)
      oReq.responseType = 'arraybuffer' // blob arraybuffer
  
      oReq.onload = function () {
        if (this.status === 200) {
          // console.log('ajax done for ', url);
          const arrayBuffer = oReq.response
          const byteArray = new Uint8Array(arrayBuffer)
          console.log(this);
          console.log(JpegReader);
          JpegReader.log()
          self.FS.writeFile(target, byteArray, { encoding: 'binary' })
          resolve(byteArray)
        } else {
          reject(this.status)
          console.error("Error in the aiax function!")
        }
      }
      oReq.send()
    })
  }

  static log() {
    console.log('hei');
  }

  static writeFile(target, byteArray) {
    console.log(this.instance);
    this.FS.writeFile(target, byteArray, { encoding: 'binary' })
  }

  // ---------------------------------------------------------------------------

  // implementation

  _storeDataFile (data, target) {
    // FS is provided by emscripten
    // Note: valid data must be in binary format encoded as Uint8Array
    this.instance.FS.writeFile(target, data, {
      encoding: 'binary'
    })
  }
}

