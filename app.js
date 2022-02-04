const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const morgan = require('morgan')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database Connected')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// app.use(morgan('tiny'))
app.use(morgan('dev')) //colorised codes
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const p = new Campground(req.body.campground)
    await p.save()
    res.redirect(`/campgrounds/${p._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })
})

app.patch('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })
    res.redirect(`/campgrounds/${id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/details', { camp })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})