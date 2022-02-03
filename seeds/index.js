const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors, duration } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database Connected')
})


const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const random20 = Math.floor(Math.random() * 20)
        const random18 = Math.floor(Math.random() * 18)
        const random6 = Math.floor(Math.random() * 6)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[random18]} ${places[random20]}`,
            price: `$${random1000} per ${duration[random6]}`
        })
        await camp.save()
    }
}

seedDB();