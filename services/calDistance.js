// calculate distances bitween two point in a 2d space
function calcDis(lat1, lon1, lat2, lon2) {
    var c = 0;
    return new Promise((resolve, reject) => {
        try {
            var dLat = power(lat2 - lat1);
            var dLon = power(lon2 - lon1);

            var a = dLat + dLon;
            c = Math.sqrt(a);
            resolve(c)
        } catch (e) {
            console.log(e);
            reject(e)
            // [Error: Uh oh!]
        }
    })

}

// return power of the value
function power(value) {
    return value * value;
}


module.exports = { calcDis };