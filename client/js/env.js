define([], function(){
  var hostURL = 'http://localhost:8000/'
    , restBase = hostURL
  ;
  return {
    restBase: restBase,
    mediaURL: restBase + 'static/media/',
    clientBase: restBase + 'client/',
    homeURL: restBase + 'client/index.html',
    loginURL: restBase + 'auth/login/?partner=1' +
      '&next='+restBase+'client/profile.html',
    logoutURL: restBase + 'auth/logout/',
  };
});


