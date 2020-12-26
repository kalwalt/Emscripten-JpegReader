import ModuleLoader from './ModuleLoader'
import Utils from './Utils'

export default class JpegReader {

  // construction
  constructor () {
    // reference to WASM module
    this.instance
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
      'readJpeg'
    ].forEach(method => {
      this[method] = this.instance[method]
    })

  }

  // ----------------------------------------------------------------------------

  // public accessors
  async loadJpeg (urlOrData) {
    const target = '/load_jpeg_' + this.jpegCount++

    let data

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

