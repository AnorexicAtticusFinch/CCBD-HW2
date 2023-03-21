function searchPhoto() {

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


  var params = {
    filename: file.name,
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