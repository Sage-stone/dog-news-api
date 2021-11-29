const PORT = process.env.PORT || 8000 
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { application, request } = require('express')

const app = express()

const newspapers = [
    {
        name: 'independent',
        address: 'https://www.independent.co.uk/topic/dogs',
        base: 'https://www.independent.co.uk'
    },
    {
        name: 'ap',
        address: 'https://apnews.com/hub/dogs',
        base: 'https://apnews.com'
    },
    {
        name: 'nbc',
        address: 'https://www.nbcnews.com/search/?q=dog',
        base: 'https://www.nbc.com'
    },
    {
        name: 'google',
        address: 'https://news.google.com/search?q=dog&hl=en-US&gl=US&ceid=US%3Aen',
        base: 'https://news.google.com'
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com',
        // base: 'https://www.cnn.com'
    },
    {
        name: 'yahoo',
        address: 'https://news.yahoo.com',
        // base: 'https://news.yahoo.com'
    },
    {
        name: 'us',
        address: 'https://www.usnews.com',
        // base: 'https://www.usnews.com'
    },
    {
        name: 'npr',
        address: 'https://npr.org',
        // base: 'https://npr.org'
    },
    {
        name: 'fox',
        address: 'https://www.foxnews.com',
        // base: 'https://www.foxnews.com'
    },
    {
        name: 'abc',
        address: 'https://abcnews.go.com',
        // base: 'https://abcnews.go.com'
    },
    {
        name: 'bbc',
        address: 'https://bbc.com',
        // base: 'https://bbc.com'
    },
    {
        name: 'cbs',
        address: 'https://www.cbsnews.com',
        // base: 'https://www.cbsnews.com'
    },
    {
        name: 'un',
        address: 'https://news.un.org',
        // base: 'https://news.un.org'
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("dog")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req,res) => {
    res.json('Welcome to your daily dose of doggy news!')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers. filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("dog")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)

        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

