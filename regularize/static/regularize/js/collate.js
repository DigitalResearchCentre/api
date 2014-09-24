function chooseRuleSet() {}
function submitCustomReg() {}

var API_ENDPOINT = 'http://localhost:8000/'
  , REGULARIZE_URL = API_ENDPOINT + 'regularize/'
;
var env = {
  API_ENDPOINT: API_ENDPOINT,
  REGULARIZE_URL: REGULARIZE_URL,
  COLLATE_URL: REGULARIZE_URL + 'collate1/',
};

window.onmessage = function(width) {
  $('body').width(width);
};

function collate(witnesses, callback) {
  return $.ajax({
    url: env.COLLATE_URL,
    type: 'POST',
    data: JSON.stringify({witnesses: witnesses}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      console.log(data);
    },
  });
}

var Entity = Backbone.Model.extend({
  urlRoot: env.API_ENDPOINT + 'entities/',
  hasTextOf: function(callback) {
    return $.get(this.url() + '/has_text_of/', callback);
  },
  witnesses: function(callback) {
    return $.get(this.url() + '/witnesses/', callback);
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
  }
});

var Rule = Backbone.Model.extend({

});

var Text = Backbone.Model.extend({
  urlRoot: env.API_ENDPOINT + 'texts/',
  xml: function(callback) {
    return $.get(this.url() + '/xml/', callback);
  },
});

function _regularize(witnesses, rules) {
  _.each(witnesses, function(witness){ 
    var content = witness.content;
    if (!witness.orig) {
      witness.orig = content;
    }
    rules = _.sortBy(rules, function(rule) {
      var re = /regularize\((.+), (.+)\)/;
      var match = re.exec(rule.action);
      rule.from = match[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      rule.to = match[2];
      return match[1].length;
    });
    _.each(rules, function(rule){
      content = content.replace(new RegExp(rule.from, 'g'), rule.to);
    });
    witness.content = content;
    return content;
  });
  return witnesses;
}


function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var csrftoken = $.cookie('csrftoken');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(function(){


  $('.change-ruleset').click(chooseRuleSet);
  $('.submit-custom-reg').click(submitCustomReg);
});
