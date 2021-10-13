import axios from 'axios'

export default class Utils {
  static async fetchRemoteData (url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return new Uint8Array(response.data)
    } catch (error) {
      throw error
    }
  }

  static async fetchRemoteDataCallback (url, callback) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        data = new Uint8Array(response.data)
        callback(response)
      })
      return response
    } catch (error) {
      throw error
    }
  }

  static _ajax (url, target) {
    return new Promise((resolve, reject) => {
      const oReq = new window.XMLHttpRequest()
      oReq.open('GET', url, true)
      oReq.responseType = 'arraybuffer' // blob arraybuffer
  
      oReq.onload = function () {
        if (this.status === 200) {
          // console.log('ajax done for ', url);
          const arrayBuffer = oReq.response
          const byteArray = new Uint8Array(arrayBuffer)
          this.instance.FS.writeFile(target, byteArray, { encoding: 'binary' })
          resolve(byteArray)
        } else {
          reject(this.status)
        }
      }
      oReq.send()
    })
  }

  static string2Uint8Data (string) {
    const data = new Uint8Array(string.length)
    for (let i = 0; i < data.length; i++) {
      data[i] = string.charCodeAt(i) & 0xff
    }
    return data
  }
}
