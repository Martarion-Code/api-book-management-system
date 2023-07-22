require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const db = require('./models')

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);


// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built in middleware to handle urlencoded form data
app.use(express.urlencoded({extender:false}));
app.use(cookieParser());
// built-in middleware for json 
app.use(express.json());

app.use('/v1/login', require('./v1/routes/authRoutes'));
app.use('/v1/register', require('./v1/routes/registerRoutes'));
// app.use('/v1/books', require('./v1/routes/bookRoutes'))
app.all('*', (req, res) =>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({"error":" 404 NOT FOUND"});
    }else{
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler);


db.sequelize.sync().then(() => {
    // create_roles();
    // app.listen(port, () => console.log(title + " run on " + baseUrl))
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
});