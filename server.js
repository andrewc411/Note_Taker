const express = require('express');
const fs = require('fs')
const path = require('path');
const api = require('./routes/index.js');
const notes = require('./routes/notes.js');
const { uuid } = require('uuidv4')

const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static( './Develop/public'));



app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/index.html'))
);

app.get('/notes-page', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)  
  } else {
    res.json(JSON.parse(data))
  }
    
})});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);


  const { title, text} = req.body;

 
  if (title && text) {
   
    const newNote = {
      title,
      text,
      id: uuid()
    };

    const response = {
      status: 'success',
      body: newNote,
    };
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNote = JSON.parse(data);
        parsedNote.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNote), (err) => {
          if (err) {
            console.error(err)
          } else {
            res.json('Success')
          }
        })
      }
    });
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);