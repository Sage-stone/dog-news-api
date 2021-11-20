const PORT = 8000    // for depoloy make: const PORT = process.env.PORT || 8000 
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { application, request } = require('express')

const app = express()

const newspapers = [
    {
        name: 'Independent',
        address: 'https://www.independent.co.uk/topic/dogs',
        base: 'https://www.independent.co.uk'
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

