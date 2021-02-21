const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
var busboy = require('connect-busboy');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');
const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware

app.use(cors());
app.use(bodyParser.json());
app.use(busboy());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload-clip', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let clip = req.files.clip;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            clip.mv('./uploads/' + clip.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: clip.name,
                    mimetype: clip.mimetype,
                    size: clip.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});



//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);