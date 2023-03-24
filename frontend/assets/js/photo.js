var speechRecognizer = null;


function searchPhoto() {

  if(speechRecognizer !== null) {
    speechRecognizer.stop();
    speechRecognizer = null;
  }

  var apigClient = apigClientFactory.newClient();
  var searchText = document.getElementById('search-text').value;

  apigClient
    .searchGet({q: searchText, "x-api-key": "superduperboomerlooperstuper"}, {})
    .then(function (res) {

      res_data = res.data.body;
      var res_data = JSON.parse(res_data);

      console.log("RESULT: ", res_data)

      if (res_data.length == 0) {
        document.getElementById('img-container').innerHTML = "Could not find any matching image. Please try again!";
      }
      else {
        document.getElementById('img-container').innerHTML = "Image search results : ";
        for (var i = 0, len = res_data.length; i < len; i++) {
          var img = new Image();
          img.src = res_data[i];
          img.setAttribute('class', 'banner-img');
          img.setAttribute('alt', 'img');
          console.log("IMG: ",img.src)
          document.getElementById('img-container').innerHTML += "<figure><img src=" + img.src + "></figure>"
        }
      }
    })
    .catch(function (result) {});
}

function getBase64String(file) {

    var reader = new FileReader();
     
    reader.onload = function () {
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        imageBase64Stringsep = base64String;
    }
    
    return reader.readAsDataURL(file);
}

function uploadPhoto() {

	var apigClient = apigClientFactory.newClient();
	var file = document.getElementById('upload_image_path').files[0];

  console.log("Uploading photo")
  console.log(file.name);
  console.log(file.type);
  console.log(customtag.value);

  file.constructor = () => file;

  var currTime = (new Date()).getTime();

  var params = {
    filename:  currTime + file.name,
    bucket: 'ccbdhw2-b2-photos-bucket',
    'x-amz-meta-customLabels': customtag.value,
    "x-api-key": "superduperboomerlooperstuper"
  };	

  var additionalParams = {
      headers: {
          'Content-Type': file.type,
      }
  };  

  var reader = new FileReader();

  reader.onload = function (event) {
      body = btoa(event.target.result);
      return apigClient.uploadBucketFilenamePut(params, file, additionalParams)
      .then(function(result) {
          console.log(result);
          alert('Image uploaded successfully!')
      })
      .catch(function(error) {
          console.log(error);
      })
  }
  reader.readAsBinaryString(file);
}

function searchPhotoVoice() {

  var apigClient = apigClientFactory.newClient();
  var result = document.getElementById('search-text');

  result.setAttribute("value", "");

  if('webkitSpeechRecognition' in window) {
    speechRecognizer = new webkitSpeechRecognition();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = true;
    speechRecognizer.lang = 'en-US';
    speechRecognizer.start();

    var finalTranscripts = '';

    speechRecognizer.onresult = function(event) {
      var interimTranscripts = '';
      for(var i = event.resultIndex; i < event.results.length; i++){
        var transcript = event.results[i][0].transcript;
        transcript.replace("\n", "<br>");
        finalTranscripts = transcript;
      }
      result.setAttribute("type", "text");
      result.setAttribute("value", finalTranscripts);
    
      console.log(finalTranscripts, " + ", interimTranscripts)
    };
    speechRecognizer.onerror = function (event) {
    };
  }else {
    result.innerHTML = 'Your browser is not supported. Please download Google chrome or Update your Google chrome!!';
  } 
}