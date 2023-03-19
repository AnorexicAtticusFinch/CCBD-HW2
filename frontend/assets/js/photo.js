function searchPhoto() {

  var apigClient = apigClientFactory.newClient();
  var searchText = document.getElementById('search-text').value;

  apigClient
    .searchGet({q: searchText}, {})
    .then(function (res) {

      res_data = res.data;

      if (res_data.length == 0) {
        document.getElementById('display').innerHTML = "Could not find any matching image. Please try again!";
      }

      res_data.forEach(function (obj) {
        var img = new Image();
        console.log(obj);
        img.src = obj;
        img.setAttribute('class', 'banner-img');
        img.setAttribute('alt', 'effy');
        document.getElementById('display').innerHTML = "Image search results : ";
        document.getElementById('img-container').appendChild(img);
        document.getElementById('display').style.display = 'block';
      });
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