var API_ENDPOINT = 'http://localhost:8000/'
  , REGULARIZE_URL = API_ENDPOINT + 'regularize/'
;
var env = {
  API_ENDPOINT: API_ENDPOINT,
  REGULARIZE_URL: REGULARIZE_URL,
  COLLATE_URL: 'http://localhost:7369/collate',
};

window.onmessage = function(width) {
  $('body').width(width);
};

var dfdCollateX = (function () {
  var dfd = new $.Deferred();
  YUI().use("node", "collatex", function(Y){
    dfd.resolve(new Y.CollateX({
      serviceUrl: env.COLLATE_URL
    }));
  });
  return dfd;
})();

var csrftoken = $.cookie('csrftoken');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function chooseRuleSet() {}
function submitCustomReg() {}

$.when(dfdCollateX, function(CollateX){

  $(function(){
    $('.change-ruleset').click(chooseRuleSet);
    $('.submit-custom-reg').click(submitCustomReg);
  });
});

