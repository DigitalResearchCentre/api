var API_ENDPOINT = 'http://localhost:8000/'
  , REGULARIZE_URL = API_ENDPOINT + 'regularize/'
;
var env = {
  API_ENDPOINT: API_ENDPOINT,
  REGULARIZE_URL: REGULARIZE_URL,
  DOC_URL: '//textualcommunities.usask.ca/api/docs/',
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
  ruleset: function() {
    if (!this._ruleset) {
      this._ruleset = mockRuleset();
    }
    return this._ruleset;
  },
  witnesses: function() {
    //return , callback);
    if (!this._witnesses) {
      this._witnesses = $.when($.get(this.url() + '/witnesses/')).then(
        function(data){
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
    return $.when(this.witnesses(), this.ruleset()).then(regularize);
  },
});

function regularize(witnesses, ruleset) {
  _.each(witnesses, function(witness){ 
    var content = witness.content;
    if (!witness.orig) {
      witness.orig = content;
    }
    var rules = _.sortBy(ruleset, function(rule) {
      rule.from = rule.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return rule.from.length;
    });
    _.each(rules, function(rule){
      witness.content = applyRule(witness.content, rule);
    });
    witness.content = content.replace(/  /g, ' ');
  });
  return witnesses;
}

function applyRule(content, rule) {
  var from = rule.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var to = rule.to;
  from = $.trim(from) + '(?=( |$))';
  if (!to || to === 'null') {
    to = '';
  }
  content = content.replace(new RegExp('^'+from, 'g'), to);
  content = content.replace(new RegExp(' '+from, 'g'), ' '+to);
  return content;
}

function collate(data) {
  return $.ajax({
    url: env.COLLATE_URL,
    dataType: 'json',
    type: 'post',
    data: JSON.stringify(data),
  });
}

function chooseRuleSet() {}
function submitCustomReg() {}

var InputManager = _.clone(Backbone.Events);
InputManager.Key = {
  LEFT_CLICK: 1,
  TAB: 9,
  ENTER: 13,
};
$(document).keydown(function(evt){
  switch (evt.which) {
    case (InputManager.Key.TAB):
      InputManager.trigger('tab');
      break;
    case (InputManager.Key.ENTER):
      InputManager.trigger('enter');
      break;
    default:
      return true;
  }
  evt.preventDefault();
});


var View = Backbone.View.extend({
  el: $('.regularization'),
  events: {
    'click .witness-name': 'onSelectWitness',
    'click .reg-table .segment': 'onSelectRegClick',
    'click .add-rule': 'onAddRule',
    'click .next-word': 'onNextWorkClick',
    'click .prev-word': 'onPrevWorkClick',
    'click .recollate': 'onRecollateClick',
  },
  initialize: function() {
    var self = this;

    this.curSegment = 0;

    this.listenTo(InputManager, 'tab', this.onTab);
    this.listenTo(InputManager, 'enter', this.onAddRule);

    this.$('.nav-tabs a:last').on('shown.bs.tab', function (e) {
      var $selected = $('.image-table .witness-name.selected');
      if (!$selected.length) {
        self.onSelectWitness({target: $('.image-table .witness-name:first')});
      }
    });

    this.loadData().then(_.bind(this.render, this));
  },
  _getSegment: function(tokens) {
    return _.map(_.isArray(tokens) ? tokens : [tokens], function(token){
      return $.trim(_.isString(token) ? token : (token && token.t || ''));
    }).join(' ');
  },
  onRecollateClick: function() {
  },
  onAddRule: function() {
    var $from = this.$('.reg-input .reg-from')
      , $to = this.$('.reg-input .reg-to')
      , from = $from.val()
      , to = $to.val()
      , rule = {from: from, to: to}
      , ruleset = this.ruleset
      , self = this
    ;
    if (!from) {
      alert('Can\'t regularize empty word or phrase');
      return;
    }
    ruleset.push(rule);
    _.each(this.alignment.table, function(col){
      _.each(col, function(tokens, i){
        var segment = self._getSegment(tokens)
          , to = applyRule(segment, rule)
        ;
        if (segment != to) {
          col[i] = to;
        }
      });
    });
    this.renderRegTable();
  },
  onTab: function() {
    var $regTable = this.$('.reg-table');
    var $next = $('.segment.selected', $regTable).next('.segment');
    if (!$next.length) {
      $next = $('.segment:first', $regTable);
    }
    this.onSelectRegFrom({
      target: $next, which: InputManager.Key.TAB
    });
  },
  onSelectRegClick: function(evt) {
    var self = this;
    if (!this._clickcount) {
      this._clickcount = 0;
    }
    this._clickcount += 1;
    if (this._clickcount == 1) {
      _.delay(function(){
        if (self._clickcount == 1) {
          self.onSelectRegFrom(evt);
        }else{
          self.onSelectRegTo(evt);
        }
        self._clickcount = 0;
      }, 300);
    }
  },
  onSelectRegFrom: function(evt) {
    var $segment = $(evt.target)
      , $regTable = this.$('.reg-table')
      , $from = $('.reg-input .reg-from')
    ;
    $('.segment.selected', $regTable).removeClass('selected');
    $segment.addClass('selected');
    $from.val($segment.text());
  },
  onSelectRegTo: function(evt) {
    var $segment = $(evt.target)
      , $to = $('.reg-input .reg-to')
    ;
    $to.val($segment.text());
  },
  onSelectWitness: function(evt) {
    var $witness = $(evt.target)
      , doc = $witness.data('doc')
      , options = {zoom: 2 , minZoom: 1, maxZoom: 5, disableDefaultUI: true}
    ;
    if (doc.image) {
      $('.image-table .witness-name.selected').removeClass('selected');
      $('.image-table .witness-name').each(function(){
        var d = $(this).data('doc');
        if (d.id === doc.id) {
          $(this).addClass('selected');
          return;
        }
      });
      var $imageMap = this.$('.image-table .image-map').empty();
      var imageMap = new ImageMap($imageMap[0], doc.image, options);
      this.$('.nav-tabs a:last').tab('show');
    }
  },
  onNextWorkClick: function(evt) {
    this.curSegment += 1;
    this.renderRegTable();
  },
  onPrevWorkClick: function(evt) {
    var moveBackOnEmpty = true;
    this.curSegment -= 1;
    this.renderRegTable(moveBackOnEmpty);
  },
  loadData: function() {
    var self = this
      , dfdRuleset = this.model.ruleset()
      , dfdWitnesses = this.model.regularize()
    ;
    return $.when(dfdRuleset, dfdWitnesses).then(function(ruleset, witnesses){
      self.witnesses = witnesses;
      self.ruleset = ruleset;
      return collate({
        witnesses: _.map(witnesses, function(w){return w;}),
        tokenComparator: {
          type: 'equality',
        },
        joined: true,
        transpositions: true,
      }).done(function(alignment){
        self.alignment = alignment;
      });
    });
  },
  render: function() {
    var ids = this.alignment.witnesses
      , witnesses = this.witnesses
      , $witnessBody = this.$('.witness-table tbody').empty()
      , $imageBody = this.$('.image-table tbody').empty()
      , self = this
    ;
    _.each(witnesses, function(witness){
      var $row = $('<tr/>');
      $row.append($('<td/>').append(self.renderWitness(witness)));
      $row.append('<td>' + witness.orig + '</td>');
      $witnessBody.append($row);

      var $imageRow = $('<tr/>');
      $imageRow.append($('<td/>').append(self.renderWitness(witness)));
      $imageBody.append($imageRow);
    });
    $('tr:first', $imageBody).append(
      '<td class="image-map" rowspan="' + ids.length + '"/>');
    this.renderRegTable();
    return this;
  },
  renderRegTable: function(moveBackOnEmpty) {
    var segments = this.alignment.table[this.curSegment]
      , $regBody = this.$('.reg-table').empty()
      , ids = this.alignment.witnesses
      , witnesses = this.witnesses
      , segmentSet = {}
      , self = this
    ;
    if (!this.alignment.table.length) {
      return;
    }
    _.each(segments, function(tokens, i){
      var segment = self._getSegment(tokens);
      if (segment) {
        if (!segmentSet[segment]) {
          segmentSet[segment] = [];
        }
        segmentSet[segment].push(ids[i]);
      }
    });

    var $rows = _.map(segmentSet, function(ids, segment){
      var $segments = $('<div class="segments"/>')
        , $segment = $('<div class="segment">' + segment + '</div>')
        , $names = $('<div/>')
      ;
      $segments.append($segment);
      $segments.append($names);
      _.each(ids, function(id){
        $names.append(self.renderWitness(witnesses[id]));
      });
      $segments.append('<div>//</div>');
      return $segments;
    });
    if (!$rows.length) {
      this.curSegment += moveBackOnEmpty ? -1 : 1;
      this.renderRegTable();
    }
    $regBody.append(_.sortBy($rows, function($row){
      return - $row.find('.witness-name').length;
    }));
  },
  renderWitness: function(witness) {
    var $witness = $('<div class="witness-name">' + witness.name + '</div>')
      , id = witness.doc
      , doc = {id: id}
    ;
    if (witness.image) {
      doc.image = env.DOC_URL + witness.image + '/has_image/';
    }
    $witness.data('doc', doc);
    return $witness;
  }
});



$(function(){
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
  ;

  var view = new View({model: entity});

  $('.change-ruleset').click(chooseRuleSet);
  $('.submit-custom-reg').click(submitCustomReg);
});


