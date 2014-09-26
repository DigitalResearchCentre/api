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

var Entity = Backbone.Model.extend({
  urlRoot: env.API_ENDPOINT + 'entities/',
  hasTextOf: function(callback) {
    return $.get(this.url() + '/has_text_of/', callback);
  },
  witnesses: function(callback) {
    //return $.get(this.url() + '/witnesses/', callback);
    return mockWitnesses(callback);
  },
  prev: function(callback) {
    return $.get(this.url() + '/prev/', callback);
  },
  next: function(callback) {
    return $.get(this.url() + '/next/', callback);
  },
  collate: function(callback) {
    var dfd = this.witnesses();
    return $.when(dfd).then(function(witnesses){
      return collate(witnesses, callback);
    });
  },
  ruleset: function(callback) {
    return mockRuleset(callback);
  },
});

function chooseRuleSet() {}
function submitCustomReg() {}

var dfdCollateX = (function () {
  var dfd = new $.Deferred();
  YUI().use("node", "collatex", function(Y){
    dfd.resolve(new Y.CollateX({
      serviceUrl: env.COLLATE_URL
    }));
  });
  return dfd;
})();

$.when(dfdCollateX, function(CollateX){
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;
  var dfdWitnesses = entity.witnesses();
  var dfdRuleset = entity.ruleset();




  $(function(){
    $('.change-ruleset').click(chooseRuleSet);
    $('.submit-custom-reg').click(submitCustomReg);
  });
});

