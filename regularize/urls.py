from django.conf.urls import patterns, include, url
from regularize.views import (
    regularization, chooseRuleSetsInterface, postSelectedRuleSets,
    chooseTextsInterface, postNewRule, changeRules, postRecollate,
    sendRecollate, getBaseTokens, postSelectedWitnesses, postNewAlign,
    changeAligns, deleteRuleSet,
)

urlpatterns = patterns('',
    url(r'^$', regularization),
    url(r'^chooseRuleSetsInterface/$', chooseRuleSetsInterface),
    url(r'^chooseTextsInterface/$', chooseTextsInterface),
    url(r'^postSelectedRuleSets/$', postSelectedRuleSets),
    url(r'^postSelectedWitnesses/$', postSelectedWitnesses),
    url(r'^postNewRule/$', postNewRule),
    url(r'^changeRules/$', changeRules),
    url(r'^postRecollate/$', postRecollate),
    url(r'^sendRecollate/$', sendRecollate),
    url(r'^getBaseTokens/$', getBaseTokens),
    url(r'^postNewAlign/$', postNewAlign),
    url(r'^changeAligns/$', changeAligns),
    url(r'^deleteRuleSet/$', deleteRuleSet),
)

