var IntroTour=IntroTour||function(e,r,n,t){"use strict";function o(){h.laterThisTour(),t.setPreferences("IntroTour",JSON.stringify(h.options))}function s(){h.neverThisTour(),t.setPreferences("IntroTour",JSON.stringify(h.options))}function i(){h.neverAllTours(),t.setPreferences("IntroTour",JSON.stringify(h.options))}function u(){h.takeThisTour(),t.setPreferences("IntroTour",JSON.stringify(h.options))}function T(){t.setPreferences("IntroTour",null)}function c(){var e=JSON.parse(t.getPreference("IntroTour",null));e&&e.remainingTours&&e.remainingTours.length>0&&(e.remainingTours[0].showDate=new Date,t.setPreferences("IntroTour",JSON.stringify(e)))}function a(){f&&(f.unSubscribeAction("later"),f.unSubscribeAction("never"),f.unSubscribeAction("start"),f.cleanup(),f=null)}function l(o){var s=null,i=this;o||(s=t.getPreference("seenVault4.0")?{remainingTours:[]}:JSON.parse(t.getPreference("IntroTour",null))),h=new e(n,s);var u=h.getAvailableTour();u&&u.showDate&&new Date>=new Date(u.showDate)&&(f=new r(u),o||(t.setPreferences("IntroTour",JSON.stringify(h.options)),f.subscribeToAction("later",this.laterThisTour),f.subscribeToAction("never",this.neverThisTour),f.subscribeToAction("start",this.takeThisTour),f.subscribeToAction("close",this.cleanup)),Topics.get(Topics.CLEAR_DATA).subscribe(function(){i&&i.cleanup&&i.cleanup()}),f.startFlow(o))}var f,h;return{start:l,cleanup:a,neverThisTour:s,laterThisTour:o,neverAllTours:i,takeThisTour:u,resetAllTours:T,makeLaterNowTours:c}}(IntroTourQueue,IntroTourFlow,IntroTourData,LPProxy);