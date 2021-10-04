const express = require('express')
const Article = require('../model/article')
const router = express.Router()
router.get('/new', (req, res) => {
    res.render('article/new', { article: new Article() })
})
// route to get the edit page edit.ejs
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('article/edit', { article: article })
})
// 
router.get('/:id', async (req, res) => {
    // find the specific article using the article id from the id present in the url
    const article = await Article.findById(req.params.id)
    // if the article not found redirect to the home page
    if (article == null) res.redirect('/')
    // we want to render the show ejs page and pass the article object to that page
    res.render('article/show', { article: article })
    res.send(req.params.id)
})
// route for posting the user entered inputs to backend
router.post('/', async (req, res, next) => {
    req.article = new Article()
    // next function says to go to the next function in the list
    next()
  }, saveArticleAndRedirect('new'))

router.delete('/:id', async (req, res) => {
    try {
        const delarticle = await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

// router to edit the article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

// path gonna be post or put
function saveArticleAndRedirect(path) {
    console.log(path)
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            console.log(article)
            // after saving the the post we want to redirect to the specific post
            // we pass in id over article id over here 
            res.redirect(`/articles/${article.id}`)
        } catch (e) {
            console.log(e)
            res.render(`/article/${path}`, { article: article })
        }
    }
}
module.exports = router