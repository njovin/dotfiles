var omsNotification=function(){function e(){var e=(Date.now()-i())/1e3;c(),openvault(!1,"omsstart",function(t){sendLpImprove("oneminute::notificationomsstart",{provider:u(),elapsedTimeInSec:e.toFixed(),textVersion:_textVersion})})}function t(){var e=(Date.now()-i())/1e3;r(oneMinuteSignup.FeatureState.cancel),c(),sendLpImprove("oneminute::notificationclose",{elapsedTimeInSec:e.toFixed(),textVersion:_textVersion})}function n(e){var t=(Date.now()-i())/1e3;r(e?oneMinuteSignup.FeatureState.postponeNextDay:oneMinuteSignup.FeatureState.postpone),c(),localStorage_setItem(db_prepend("oms_postponed_date"),Date.now()),e||sendLpImprove("oneminute::notificationnotnowclicked",{elapsedTimeInSec:t.toFixed(),textVersion:_textVersion})}function o(){LPPlatform.onTabActivated(function(e){f.opened&&(c(),f.tabInterface=e,a(e))}),LPPlatform.onTabUpdated(function(e){f.opened&&e.tabDetails.tabID===f.tabInterface.tabDetails.tabID&&(f.opened=!1,f.tabInterface=e,a(e))})}function a(e){var t=OmsNotificationPopup.getState();if(lploggedin&&!isOffline()&&g_onemin_advert_enabled&&!(s()>g_onemin_advert_app_threshold)&&!f.opened&&t!==oneMinuteSignup.FeatureState.started&&t!==oneMinuteSignup.FeatureState.cancel){if(t===oneMinuteSignup.FeatureState.postpone||t===oneMinuteSignup.FeatureState.postponeNextDay){var n=parseInt(localStorage_getItem(db_prepend("oms_postponed_date"))),o=parseInt(localStorage_getItem(db_prepend("oms_postponed_threshold_days")));o=isNaN(o)?7:o,t===oneMinuteSignup.FeatureState.postponeNextDay&&(o=1);var a=24*o*60*60*1e3;if(Date.now()-n<a)return}g||(d=Date.now(),g=!0,sendLpImprove("oneminute::notificationshown",{textVersion:_textVersion}));e.getTop().LPFrame.openDialog("omsNotificationPopup",{provider:u(),textVersion:_textVersion},{css:{top:0,right:0},callback:function(e){f.dialogId=e}}),f.opened=!0,f.tabInterface=e}}function i(){return d}function r(e){switch(e){case oneMinuteSignup.FeatureState.started:localStorage_setItem(db_prepend("oms_state"),oneMinuteSignup.FeatureState.started);break;case oneMinuteSignup.FeatureState.cancel:localStorage_setItem(db_prepend("oms_state"),oneMinuteSignup.FeatureState.cancel);break;case oneMinuteSignup.FeatureState.postpone:localStorage_setItem(db_prepend("oms_state"),oneMinuteSignup.FeatureState.postpone);break;case oneMinuteSignup.FeatureState.postponeNextDay:localStorage_setItem(db_prepend("oms_state"),oneMinuteSignup.FeatureState.postponeNextDay)}}function p(){return localStorage_getItem(db_prepend("oms_state"))}function s(){var e=0;for(var t in g_sites)g_sites.hasOwnProperty(t)&&e++;return e}function u(){if(g_username){if(g_username.indexOf("@gmail")!==-1)return"Gmail";if(g_username.indexOf("@yahoo")!==-1)return"Yahoo";if(g_username.indexOf("@outlook")!==-1)return"Office365"}return"Unknown"}function c(){f.opened=!1;var e=f.dialogId;e&&f.tabInterface&&LPTabs.get({tabID:f.tabInterface.tabDetails.tabID,callback:function(t){var n=t.getTop();if(n){n.LPFrame.close(e)}}})}var d,f={opened:!1,tabInterface:null,dialogId:-1},l=-1,g=!1;return function(){_textVersion=Math.ceil(2*Math.random()),o(),l=setInterval(function(){LPPlatform.getCurrentTab(function(e){a(e)})},1e4)}(),{startOms:e,cancelNotification:t,postponeNotification:n,setState:r,getState:p}}();