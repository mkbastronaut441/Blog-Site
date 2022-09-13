const express = require('express');
const { hostname } = require('os');
const { nextTick } = require('process');
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog');
const exp = require('constants');


const app = express();
const dbURI='mongodb+srv://netninja:12345@nodetuts.4f32i.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>app.listen(3000))
.catch((err)=>console.log(err))

// express app

// to read json file as normal string
app.set('view engine','ejs')


//make files accessible to the browser that are stored in public
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))


//info about the method
//app.use(morgan('dev'))

/// app.set('views', 'myviews');

app.get('/add-blog',(req,res)=>{
  const blog = new Blog({
    title:'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  })
  blog.save()
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/all-blogs',(req,res)=>{
  Blog.find()
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/single-blog',(req,res)=>{
  Blog.findById('62e23f2d37e97f289a1582b0')
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
})




// 0 homepage -> blogs 1
app.get('/', (req, res) => {
  res.redirect('/blogs')
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});



app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// blogs -1
app.get('/blogs',(req,res)=>{
  Blog.find().sort({createdAt :-1 })
  .then((result)=>{
    res.render('index',{title: 'all blogs',blogs:result})
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.post('/blogs',(req,res)=>{
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });




})

app.get('/blogs/:id',(req,res)=>{
  const id = req.params.id
  Blog.findById(id)
  .then((result)=>{
    res.render('details',{blog: result,title : 'Blog details'})
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.delete('/blogs/:id',(req,res)=>{
  const id= req.params.id;
  Blog.findByIdAndDelete(id)
  .then((result)=>{
    res.json({redirect:'/blogs'})
  })
  .catch((err)=>{
    console.log(err)
  })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
