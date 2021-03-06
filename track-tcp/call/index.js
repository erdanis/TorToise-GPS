const { ConnectionError, HttpError } = require('./errors')
const axios = require ('axios')
const validate = require('./validate')
	
	

	function call(url, options = {}) {
	    const { method = 'GET', headers, data } = options
	
	    validate.arguments([
	        { name: 'url', value: url, type: String, notEmpty: true },
	        { name: 'method', value: method, type: String, notEmpty: true },
	        { name: 'headers', value: headers, type: Object, optional: true },
	        { name: 'data', value: data, type: Object, optional: true }
	    ])
	
	    validate.url(url)
	
	    return (async () => {
	        try {
	            const response = await axios({
	                headers,
	                method,
	                url,
	                data
	            })
	
	            return response.data
	        } catch (error) {
	            if (error.code === 'ENOTFOUND') throw new ConnectionError('cannot connect')
	
	            const { response } = error
	
	            if (response && response.status) {
	                const err = new HttpError()
	
	                err.status = response.status
	
	                throw err
	            }
	
	            throw error
	        }
	    })()
	}
	
	
	module.exports = call
	//export default call 