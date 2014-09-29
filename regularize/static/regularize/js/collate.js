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
  ruleset: function() {
    if (!this._ruleset) {
      this._ruleset = mockRuleset();
    }
    return this._ruleset;
  },
  witnesses: function() {
    //return $.get(this.url() + '/witnesses/', callback);
    if (!this._witnesses) {
      this._witnesses = $.when(mockWitnesses()).then(function(data){
        var witnesses = {};
        _.each(data, function(witness){
          var content = witness.content;
          content.replace(/  /g, ' ');
          witness.content = $.trim(content);
          witnesses[witness.id] = witness;
        });
        return witnesses;
      });
    }
    return this._witnesses;
  },
  regularize: function() {
    return $.when(this.witnesses(), this.ruleset()).then(
      function(witnesses, ruleset){ 
      _.each(witnesses, function(witness){ 
        var content = witness.content;
        if (!witness.orig) {
          witness.orig = content;
        }
        var rules = _.sortBy(ruleset, function(rule) {
          rule.from = rule.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          rule.to = match[2];
          return rule.from.length;
        });
        _.each(rules, function(rule){
          var from = $.trim(rule.from) + '(?=( |$))';
          var to = rule.to;
          if (!to || to == 'null') {
            to = '';
          }
          content = content.replace(new RegExp('^'+from, 'g'), to);
          content = content.replace(new RegExp(' '+from, 'g'), ' '+to);
        });
        witness.content = content.replace(/  /g, ' ');
      });
      return witnesses;

    });
  }
});

function collate(data, callback) {
  return $.ajax({
    url: env.COLLATE_URL,
    dataType: 'json',
    type: 'post',
    data: JSON.stringify(data),
    success: callback,
  });
}

function chooseRuleSet() {}
function submitCustomReg() {}

$(function(){
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;
  var dfdWitnesses = entity.witnesses();
  var dfdRuleset = entity.ruleset();

  $.when(dfdWitnesses, dfdRuleset).then(function(witnesses, ruleset){
    witnesses = {
        a: {id: 'a', tokens: [
        {t: 'hello'},
        {t: 'world'},
        {t: 'foo'},
        {t: 'bar'},
      ]},
        b: {id: 'b', tokens: [
        {t: 'hello world'},
        {t: 'foo bar'},
      ]},
        c: {id: 'c', tokens: [
        {t: 'hello'},
        {t: 'world foo'},
        {t: 'bar'},
      ]},
        d: {id: 'd', tokens: [
        {t: 'hello'},
        {t: 'bar'},
      ]},
    };
    collate({
      witnesses: _.map(witnesses, function(w){return w})/*_.map(witnesses, function(witness){
        var content = witness.content;
        witness.tokens = [];
        _.each(content.split(' '), function(token){
          witness.tokens.push({t: token, n: 'oooo'});
        });
        console.log(witness);
        return witness;
      })*/,
      tokenComparator: {
        type: 'levenshtein',
        distance: 2,
      },
      joined: true,
    }, function(data){
      _.each(witnesses, function(witness){
        witness.tokens = [];
      });
      var witnessIds = data.witnesses;
      _.each(data.table, function(col, colIndex){
        _.each(col, function(token, i){
          var id = witnessIds[i];
          witnesses[id].tokens.push(token);
        });
      });

      var $table = $('.witness-table');
      _.each(witnesses, function(witness){
        var $row = $('<div class="row"/>');
        _.each(witness.tokens, function(token){
          var $t = $('<div class="col-xs-4"/>');
          _.each(token, function(token){
            $t.append('<span>' + token.t + '</span>');
          });
          $row.append($t);
        });
        $table.append($row);
      });

      console.log(witnesses);
    });
  });

  $('.change-ruleset').click(chooseRuleSet);
  $('.submit-custom-reg').click(submitCustomReg);
});

