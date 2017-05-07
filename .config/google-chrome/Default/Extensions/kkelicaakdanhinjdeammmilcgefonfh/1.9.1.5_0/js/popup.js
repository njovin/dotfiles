$(function(){
			jQuery.fx.off = true;

			$('#v2-beta .show').on('click', function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'https://chrome.google.com/webstore/detail/window-resizer-beta/pnhnbekjlbamfnnemcaolkjchjlidbib', selected : true } );
				window.close();
			})

			$('#v2-beta .hide').on('click', function(e) {
				e.preventDefault();
				$('#v2-beta').addClass('hidden');
				window.localStorage['WindowResizer.HideV2Banner'] = 1;
			})

			if (window.localStorage['WindowResizer.HideV2Banner'] != 1) {
				$('#v2-beta').removeClass('hidden');
			}

			displayRows();

			var oldWidth = window.localStorage['WindowResizer.PopupWidth'];
			if ( parseInt(oldWidth) == 0 || oldWidth == undefined ) {
				oldWidth = window.localStorage['WindowResizer.PopupWidth'] = 250;
			}

			$('#resolutionsList, #specialPageNotice').css('width', oldWidth + 'px');

			if ( window.localStorage[popupDescriptionSetting] == 1 ) {
				$('.resDetail').css('display', 'none');
				$('.handle STRONG').css('font-weight', 'normal');
			}

			var customize = ( $('.resRow').size() ) ? ' customize' : '';

			$('#resolutionsList').append('<li class="resRow secondary' + customize + '" id="rowEdit"><a href="#" class="handle" id="customize"><span class="icon i_resolutions"></span>Edit presets</a></li>');
			$('#resolutionsList').append('<li class="resRow secondary" id="rowSettings"><a href="#" class="handle" id="settings"><span class="icon i_settings"></span>Settings</a></li>');
			// $('#resolutionsList').append('<li class="resRow"><a href="#" class="handle" id="support"><span class="icon i_bulb"></span>Support</a></li>');

			var verNo = window.localStorage[verStorage] || 0;

			if ( verNo != currentVersion) {
				//$('#resolutionsList').append('<li class="resRow updated secondary" id="rowUpdate"><a href="#" class="handle" id="news"><span class="icon i_bulb"></span>UPDATE: Please read!</a></li>');

				$.get('-release-notes.html', function(data) {
					$('#updateNotice .content').html($(data).first());
					$('#updateNotice').show();
					$('#resolutionsList').hide();
				});
			}

			$('#updateNoticeButton').on('click', function(e) {
				e.preventDefault();
				$('#updateNotice').hide();
				$('#resolutionsList').show();

				window.localStorage[verStorage] = currentVersion;
				chrome.browserAction.setBadgeText({text : ''});
			})


			$('.resRow:not(.secondary) .handle').click(function(e){
				e.preventDefault();

				var ignorePopup = !e.screenX && !e.screenY, // if Enter was pressed
				    settings    = $(this.parentNode).data('settings');

				currentResolutionID = settings.ID;

				resizeWindow(settings, ignorePopup);
			});

			$('#customize').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'options.html', selected : true } );
				window.close();
			});

			$('#settings').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'settings.html', selected : true } );
				window.close();
			});

			// $('#support').click( function(e) {
			// 	e.preventDefault();
			// 	chrome.tabs.create( { url : 'poll.html', selected : true } );
			// });

			$('#news').click( function(e) {
				e.preventDefault();
				chrome.tabs.create( { url : 'news.html', selected : true } );
				window.close();
			});


			$('#specialPageNoticeButton').click(function() {
				window.close();
			});


			$('body').on('keydown', function(e) {
				var current = $('.resRow .handle:focus').parent(),
				    next;

				switch (e.which) {
					case 38 : // Up Arrow
						next = current.prev().size() ? current.prev() : $('.resRow').last();
					break;

					case 40 : // Down Arrow
						next = current.next().size() ? current.next() : $('.resRow').first();
					break;

					case 69 : // E
						$('#customize').click();
					break;

					case 83 : // S
						$('#settings').click();
					break;

					case 85 : // U
						$('#news').click();
					break;

					default :
						if (e.which >= 48 && e.which <= 57) {
							var key = (e.which - 48) || 10;
							$('#row' + (key - 1) + ' .handle').click();
						}
					break;
				}

				next && next.find('.handle').focus();
			})
		});