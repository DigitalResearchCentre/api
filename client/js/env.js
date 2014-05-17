define([], function(){
  var hostURL = 'http://localhost:8000/'
    , restBase = hostURL
  ;
  return {
    restBase: restBase,
    mediaURL: restBase + 'static/media/',
    clientBase: restBase + 'client/',
    homeURL: restBase + 'client/index.html',
    loginURL: restBase+ 'auth/login/',
    logoutURL: restBase + 'auth/logout/',
  };
});


