var BASE_URL = 'http://textualcommunities.usask.ca/api/'

var TC = {
  _api: null,
  get: function(key, data) {
    var _api = TC._api
      , args = Array.prototype.slice.call(arguments)
    ;
    data || (data = {});
    if (!_api) {
      return $.get(BASE_URL).then(function (resp) {
        TC._api = resp;
        return TC.get(key, data);
      });
    }else{
      data.page_size || (data.page_size = 0);
      console.log(data);
      return $.get(_api[key], data);
    }
  },
  getCommunities: function(data) {
    return TC.get('communities', data);
  }
}

/************** example  **************/

TC.getCommunities().done(function (resp) {
  console.log('111');
  console.log(resp);
});
