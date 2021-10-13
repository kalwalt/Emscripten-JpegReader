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

}
