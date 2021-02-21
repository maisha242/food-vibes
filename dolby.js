const fs = require('fs');
const axios = require('axios').default;
var $ = require("jquery");
const APIKEY = 'aLoqEU72Rz9Th9tORbixy0iQRxIVJpAG';
//const file_path = process.env.INPUT_MEDIA_LOCAL_PATH;
const file_path = 'C:/Users/Cumtown/Documents/BRUH/sample.wav';
const output_path = 'C:/Users/Cumtown/Documents/BRUH/sample-enhanced.wav';
const media_input_config = {
  method: 'post',
  url: 'https://api.dolby.com/media/input',
  headers: {
    'x-api-key': APIKEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  data: {
    url: 'dlb://in/sample.wav'
  }
};


function download_file(filename) {
  let media_get_config = {
    method: 'get',
    url: 'https://api.dolby.com/media/output',
    headers: {
      'x-api-key': APIKEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    responseType: 'stream',
    params: {
      url: 'dlb://out/' + filename
    }
  };
  axios(media_get_config)
    .then(function(response) {
      response.data.pipe(fs.createWriteStream(output_path));
      response.data.on('error', function(error) {
        console.log(error);
      });
      response.data.on('end', function() {
        console.log('File downloaded!');
      });
    }).catch(function(error) {
      console.log(error);
    });
}

function enhance_file(filename) {
  let media_enhance_config = {
    method: 'post',
    url: 'https://api.dolby.com/media/enhance',
    headers: {
      'x-api-key': APIKEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      input: 'dlb://in/sample.wav',
      output: 'dlb://out/${filename}'
    }
  };
  axios(media_enhance_config)
    .then(function(response) {
      console.log(response.data.job_id);
    }).then(download_file("sample-enhanced"))
    .catch(function(error) {
      console.log(error);
    })
}
function upload_file() {
  axios(media_input_config).then((response)=>{
    let upload_config = {
      method: 'put',
      url: response.data.url,
      data: fs.createReadStream(file_path),
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fs.statSync(file_path).size
      }
    }
    axios(upload_config).then(function() {
      console.log("File uploaded");
    }).then().catch(function(error) {
      console.log(error);
    });)
}
//  Upload file


//  Enhance file
