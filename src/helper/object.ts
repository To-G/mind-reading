export const snakeNameWithObject = (object: any, encode: boolean=false) => {

    if (Array.isArray(object)) {
        
        object.forEach((item, index) => {
            object[index] = snakeNameWithObject(item, encode)
        })

    }
    else if (object !== null && typeof object == 'object' && !Array.isArray(object)) {
        
        object = Object.assign({}, object)

        for(let key in object) {

            if (typeof object[key] == 'object') {
                object[key] = snakeNameWithObject(object[key], encode)
            }

            let newKey = encode ? key.replace(/([A-Z])/g, "_$1").toLowerCase() : key.replace(/_(\w)/g, ($0, $1) => {
                return $1.toUpperCase();
            })

            if (newKey != key) {
                object[newKey] = object[key];
                delete object[key];
            }
        }

    }

    return object;

}