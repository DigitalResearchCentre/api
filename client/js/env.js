define([], function(){
  var hostURL = 'http://localhost:8000/'
    , restBase = hostURL
  ;
  return {
    mediaURL: '',
    restBase: restBase,
    clientBase: restBase + 'client/',
    homeURL: restBase + 'client/index.html',
    loginURL: restBase+ 'auth/login/',
    logoutURL: restBase + 'auth/logout/',
  };
});


