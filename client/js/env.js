define([], function() {
  //var hostURL = 'http://textualcommunities.usask.ca'
  //  , restBase = hostURL + '/api'
  //  , mediaURL = hostURL + '/media/tc/'
  //;
  var hostURL = 'http://localhost:8000'
    , restBase = hostURL
    , mediaURL = hostURL + '/media/tc/'
  ;


  return {
    restBase: restBase,
    mediaURL: mediaURL,
    homeURL: restBase + '/client/index.html',
    profileURL: restBase + '/client/profile.html',
    loginURL: restBase + '/auth/login/?' +
      'next=' + restBase + '/client/profile.html' 
  };
});
