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