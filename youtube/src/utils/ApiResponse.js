// hum khud ki file banayenge jisme api response handle karenge
// 1. success response
class ApiResponse {
    constructor( statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message =message
        this.success = this.success < 400
    }
}

export { ApiResponse }