import axios from 'axios'

export const getFilters = async (options) => {
  try {
    const response = await axios({
      method: options.method,
      responseType: 'json',
      url: `https://polvoapis.consensotec.com.br/polvo-platform-rest-api/${options.url}`,
      data: options.data,
      timeout: 20000
    })
  
    return response.data
  } catch (error) {
    console.log(error)
  }
}
