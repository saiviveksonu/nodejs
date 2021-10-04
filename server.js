const express=require('express')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const Article=require('./model/article')
// connecting the database to the server
mongoose.connect('mongodb://localhost/blog',{ useNewUrlParser: true,useUnifiedTopology: true })
const app=express()
// use the router file in our appllication
const articleroute=require('./routes/routes')
// this view engine converts our ejs code to htm
app.set('view engine','ejs')

// by this we can use the different parameters in our article form inside our router
app.use(express.urlencoded({extended:false}))

app.use(methodOverride('_method'))

app.get('/',async(req,res)=>{ 
    const articles=await Article.find().sort({createdat:'desc'})
    // we can use this articles object in our index.ejs as we are passing here
    res.render('article/index',{articles:articles})
})
// telling our application to use that router and it should be at "/articles"
// by this every single route we create gets added to "/articles"
app.use('/articles',articleroute) 

app.listen(5000,()=>{console.log("sucessfully running the port")})