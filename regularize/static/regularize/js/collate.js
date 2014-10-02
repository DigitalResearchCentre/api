var API_ENDPOINT = 'http://localhost:8000/'
  , REGULARIZE_URL = API_ENDPOINT + 'regularize/'
;

_.extend(ENV, {
  API_ENDPOINT: API_ENDPOINT,
  REGULARIZE_URL: REGULARIZE_URL,
  DOC_URL: '//textualcommunities.usask.ca/api/docs/',
  COLLATE_URL: REGULARIZE_URL + 'collate1/',
});

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
  urlRoot: ENV.API_ENDPOINT + 'entities/',
  hasTextOf: function(callback) {
    return $.get(this.url() + '/has_text_of/', callback);
  },
  ruleset: function() {
    if (!this._ruleset) {
      var url = this.url() + '/ruleset/' + ENV.user;
      this._ruleset = $.when($.get(url)).then(function(d){
        return d.ruleset || [];
      });
    }
    return this._ruleset;
  },
  alignment: function() {
    if (!this._alignment) {
      var url = this.url() + '/ruleset/' + ENV.user;
      this._alignment = $.when($.get(url)).then(function(d){
        return d.alignment || {};
      });
    }
    return this._alignment;
  },
  saveAll: function(alignment, ruleset){
    return $.ajax({
      url: ENV.REGULARIZE_URL + 'save/',
      dataType: 'json',
      type: 'post',
      data: {
        entity: this.id,
        data: JSON.stringify({
          alignment: alignment,
          ruleset: ruleset,
        }),
      },
    });
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
  regularize: function(witnesses, ruleset) {
    if (!witnesses) {
      witnesses = this.witnesses();
    }
    if (!ruleset) {
      ruleset = this.ruleset();
    }
    return $.when(witnesses, ruleset).then(regularize);
  },
});

function regularize(witnesses, ruleset) {
  _.each(witnesses, function(witness){ 
    var content = '';
    if (witness.orig) {
      content = witness.orig;
    }else{
      content = witness.content;
      witness.orig = content;
    }
    var rules = _.sortBy(ruleset, function(rule) {
      return rule.from.length;
    });
    _.each(rules, function(rule){
      content = applyRule(content, rule);
    });
    witness.content = content.replace(/  /g, ' ');
  });
  return witnesses;
}

function applyRule(content, rule) {
  if (!rule.apply || rule.delete) {
    return content;
  }
  var from = rule.from.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
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
    url: ENV.COLLATE_URL,
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
    'click .next-entity': 'onNextEntityClick',
    'click .prev-entity': 'onPrevEntityClick',
    'click .recollate': 'onRecollateClick',
    'click .confirm-alignment': 'onConfirmAlignmentClick',
    'click .invariant,.variant,.empty': 'onAlignmentClick',
    'click .save': 'onSave',
  },
  initialize: function() {
    var self = this;

    this.curSegment = 0;

    this.listenTo(InputManager, 'tab', this.onTab);
    this.listenTo(InputManager, 'enter', this.onAddRule);

    $('.confirm-alignment').hide();
    this.$('.nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var $this = $(e.target)
        , href = $this.attr('href')
      ;
      if (href == '#image-table') {
        var $selected = $('.image-table .witness-name.selected');
        if (!$selected.length) {
          self.onSelectWitness({target: $('.image-table .witness-name:first')});
        }
      }else if (href == '#alignment-table') {
        $('.add-rule,.next-word,.prev-word,.recollate').hide();
        $('.confirm-alignment').show();
      }else if (href == '#reg-table') {
        $('.add-rule,.next-word,.prev-word,.recollate').show();
        $('.confirm-alignment').hide();
      }
    });

    this.loadData().then(_.bind(this.render, this));
  },
  _getSegment: function(tokens) {
    return _.map(_.isArray(tokens) ? tokens : [tokens], function(token){
      return $.trim(_.isString(token) ? token : (token && token.t || ''));
    }).join(' ');
  },
  recollate: function(alignment) {
    var dfdWitnesses = this.model.regularize(this.witnesses, this.ruleset)
      , self = this
    ;
    this.curSegment = 0;
    return $.when(dfdWitnesses).then(function(witnesses){
      self.witnesses = witnesses;
      console.log(alignment);
      if (alignment && alignment.table) {
        self.alignment = alignment;
        return;
      }else{
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
      }
    });
  },
  onRecollateClick: function() {
    var self = this;
    this.recollate().done(function(){
      self.renderRegTable();
    });
  },
  onSave: function() {
    var self = this;
    this.onConfirmAlignmentClick();
    this.model.saveAll(this.alignment, this.ruleset).done(function(){
      self._changed = false;
    });
  },
  onPrevEntityClick: function() {
    var uri = URI()
      , entity = ENV.prevEntity
    ;
    if (entity) window.location = uri.query({entity: entity});
  },
  onNextEntityClick: function() {
    var uri = URI()
      , entity = ENV.nextEntity
    ;
    if (entity) window.location = uri.query({entity: entity});
  },
  onAddRule: function() {
    var $from = this.$('.reg-input .reg-from')
      , $to = this.$('.reg-input .reg-to')
      , from = $from.val()
      , to = $to.val()
      , rule = {from: from, to: to, apply: true}
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
    this._changed = true;
  },
  onTab: function() {
    var $regTable = this.$('.reg-table');
    var $next = $('.selected.segments', $regTable).next('.segments');
    if (!$next.length) {
      $next = $('.segments:first', $regTable);
    }
    this.onSelectRegFrom({
      target: $('.segment', $next), which: InputManager.Key.TAB
    });
  },
  _checkClick: function(evt, onSingleClick, onDblClick) {
    var self = this;
    if (!this._clickcount) {
      this._clickcount = 0;
    }
    this._clickcount += 1;
    if (this._clickcount == 1) {
      _.delay(function(){
        if (self._clickcount == 1) {
          onSingleClick.call(self, evt);
        }else{
          onDblClick.call(self, evt);
        }
        self._clickcount = 0;
      }, 300);
    }
    if (this._clickcount > 1) {
      _.delay(function(){
        if (this._clickcount > 1) this._clickcount = 0;
      }, 300);
    }
  },
  onConfirmAlignmentClick: function() {
    var table = [];
    $('.alignment-table tbody tr').each(function(j, tr){
      $('.variant,.invariant,.empty', $(tr)).each(function(i, td){
        var segment = $(td).text();
        while (table.length <= i) {
          table.push([]);
        }
        table[i].push(segment || []);
      });
    });
    this.alignment.orig = this.alignment.table;
    this.alignment.table = table;
  },
  onAlignmentClick: function(evt) {
    var $td = $(evt.target);
    evt.preventDefault();
    if ($td.hasClass('invariant') || $td.hasClass('variant')) {
      $td.before('<td class="empty"/>');
    } else if ($td.hasClass('empty')){
      $td.remove();
    }
    this._changed = true;
  },
  onSelectRegClick: function(evt) {
    this._checkClick(evt, this.onSelectRegFrom, this.onSelectRegTo);
  },
  onSelectRegFrom: function(evt) {
    var $segment = $(evt.target)
      , $regTable = this.$('.reg-table')
      , $from = $('.reg-input .reg-from')
    ;
    $('.segments.selected', $regTable).removeClass('selected');
    $segment.closest('.segments').addClass('selected');
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
      , dfdAlignment = this.model.alignment()
    ;
    return $.when(dfdRuleset, dfdAlignment).then(function(ruleset, alignment){
      self.ruleset = ruleset;
      return self.recollate(alignment);
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

    window.onbeforeunload = function() {
      if (self._changed) {
        return 'There are unsaved changes. Those work will lost if you leave without saving.';
      }
    };
    return this;
  },
  renderRegTable: function(moveBackOnEmpty) {
    var table = this.alignment.table
      , curSegment = this.curSegment
      , segments = table[curSegment]
      , $regBody = this.$('.reg-table').empty()
      , ids = this.alignment.witnesses
      , witnesses = this.witnesses
      , segmentSet = {}
      , self = this
      , $alignment = $('.alignment-table tbody').empty()
      , $alignmentRows = null
    ;
    if (curSegment === 0) {
      this.$('.prev-word').hide();
    }else{
      this.$('.prev-word').show();
    }
    if (curSegment >= table.length - 1) {
      this.$('.next-word').hide();
      this.curSegment = table.length - 1;
    }else{
      this.$('.next-word').show();
    }
    if (!table.length) {
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

    _.each(witnesses, function(witness){
      var $wit = self.renderWitness(witness);
      var $td = $('<td/>').append($wit);
      $alignment.append($('<tr/>').append($td));
    });
    $alignmentRows = $('tr', $alignment);
    _.each(table, function(col, j){
      var segsCol = _.map(col, function(tokens){
        return self._getSegment(tokens);
      });
      var uniq = (_.without(_.uniq(segsCol, function(r){
        return $.trim(r).toLowerCase();
      }), '').length === 1);
      _.each(segsCol, function(segment, i){
        var cls = segment ? (uniq ? 'invariant' : 'variant') : 'empty'; 
        var $td = $('<td class="' + cls + '">' + segment + '</td>');
        $td.data({col: j, row: i});
        $($alignmentRows[i]).append($td);
      });
    });

    var rows = _.map(segmentSet, function(ids, segment){
      var $segments = $('<div class="segments"/>')
        , $segment = $('<div class="segment">' + segment + '</div>')
        , $names = $('<div/>')
      ;
      $segments.append($segment);
      $segments.append($names);
      _.each(ids, function(id){
        $names.append(self.renderWitness(witnesses[id]));
      });
      return $segments;
    });

    if (!rows.length) {
      this.curSegment += moveBackOnEmpty ? -1 : 1;
      if (this.curSegment >= table.length) {
        this.curSegment = 0;
      }
      this.renderRegTable();
    }
    $regBody.append(_.sortBy(rows, function($row){
      return - $row.find('.witness-name').length;
    }));

    $('.segments:not(:last)', $regBody).append('<div>//</div>');

    this.renderRuleTable();
  },
  renderRuleTable: function() {
    var $table = this.$('.rule-table tbody').empty();
    var self = this;
    _.each(this.ruleset, function(rule){
      if (rule.delete) return;
      var $tr = $('<tr/>');
      var checked = rule.apply ? 'true': 'false';
      var $checkbox = $(
        '<input class="apply-rule" type="checkbox" checked="' + checked + '"/>');
      var $remove = $('<div class="remove-rule glyphicon glyphicon-remove-circle"></div>');
      $checkbox.change(function(){
        if ($(this).is(':checked')) {
          rule.apply = true;
        } else {
          rule.apply = false;
        }
      });
      $tr.append($('<td></td>').append($checkbox))
        .append($('<td>All witnesses, this block</td>'))
        .append($('<td>' + rule.from + '</td>'))
        .append($('<td>' + rule.to + '</td>'))
        .append($('<td></td>').append($remove))
      ;
      $remove.click(function(evt){
        evt.preventDefault();
        rule.delete = true;
        $tr.remove();
        self._changed = true;
      });
      $table.append($tr);
    });
  },
  renderWitness: function(witness) {
    var $witness = $('<div class="witness-name">' + witness.name + '</div>')
      , id = witness.doc
      , doc = {id: id}
    ;
    if (witness.image) {
      doc.image = ENV.DOC_URL + witness.image + '/has_image/';
    }
    $witness.data('doc', doc);
    return $witness;
  }
});



$(function(){
  var uri = URI()
    , entityId = uri.query(true).entity
    , entity = new Entity({id: entityId})
    , urn = ENV.urn
  ;

  var view = new View({model: entity});

  if (!ENV.prevEntity) {
    $('.prev-entity').hide();
  }
  if (!ENV.nextEntity) {
    $('.next-entity').hide();
  }

  $('.more').click(function(){
    $(this).closest('.instruction').toggleClass('expand');
  });
  $('.entity-name').text(urn.split(':').splice(4).join(',').replace('=', ' '));
  $('.change-ruleset').click(chooseRuleSet);
  $('.submit-custom-reg').click(submitCustomReg);

});


