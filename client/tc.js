var BASE_URL = 'http://localhost:8000/'

var _api = null;

var TC = {
  api: function(key, data, callback) {
    if (!_api) {
      $.get(BASE_URL, function(resp) {
        _api = resp;
        $.get(url, data, callback);
      });
    }else{
      $.get(_api[key], data, callback);
    }
  }
}

TC.Community = function() {

}


