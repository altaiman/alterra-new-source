(function(root) {

	// Инициализация прилдожения
	var windowWidth = $(window).width();

	function init() {

		if ($('.gallery').get(0)) {
			$('.gallery__element').first().trigger('click');
		}

		$('[data-tabs]').each(function(i, tabs) {
			$(tabs).children().first().trigger('click');
		});

		$('.toggle_close').each(function(i, toggle) {
			var data = $(this).data('toggle');

			$(this).parent().find('.'+data).hide();
		});
	};

	var evt = new Event(),
  		m = new Magnifier(evt);

	$(window).on('resize', function() {
		windowWidth = $(window).width();

		if (windowWidth <= 960 && $('.container__side-scroll').parent().hasClass('sticky-wrapper')) {
			$('.container__side-scroll').unstick();
		} else if (windowWidth > 960 && $('.container__side-scroll').get(0) && !$('.container__side-scroll').parent().hasClass('sticky-wrapper')) {
			stickySide();
		}
	});

	// Слайдеры
	var dataSliders = {
		feautures: {
			items: 6,
			nav: true
		},
		gallery: {
			items: 1,
			nav: true,
			dots: true,
			mouseDrag: false,
			responsive: {
				961: {
					items: 4,
					dots: false
				}
			}
		},
		promo: {
			items: 1,
			dots: true,
			loop: true,
			autoplay: true,
		},
		shop: {
			items: 1,
			loop: true,
			nav: false,
			center: false,
			responsive: {
				680: {
					items: 3,
					center: true,
					nav: true,
				}
			}
		}
	}

	$('[data-slider]').each(function(i, slider) {
		var data = $(this).data('slider');

		$(slider).owlCarousel(dataSliders[data])
	});

	$('.range__slider').each(function() {
		var range = this,
				minInput = $(range).closest('.range').find('[data-input="min"]'),
				maxInput = $(range).closest('.range').find('[data-input="max"]');

		function update() {
			var from = $(range).data('from'),
					to = $(range).data('to');

			$(minInput).val(from);
			$(maxInput).val(to);
		}

		$(range).ionRangeSlider({
			extra_classes: 'range__slider',
			hide_min_max: true,
			hide_from_to: true,
		});

		update();
		$(range).on('change', update);
	});

	$('[data-input]').on('change', function() {
		var range = $(this).closest('.range').find('input.range__slider').data("ionRangeSlider"),
				val = $(this).val(),
				min = range.options.min,
				max = range.options.max,
				from = range.options.from,
				to = range.options.to,
				step = range.options.step;

		switch ($(this).data('input')) {
			case 'min':
				if (val <= min) {
					val = min;
				} else if (val >= max) {
					val = max - step;
				} else if (val >= to) {
					val = to - step;
				}

				range.update({
					from: val
				});
				break;
			case 'max':
				if (val >= max) {
					val = max;
				} else if (val <= min) {
					val = min + step;
				} else if (val <= from) {
					val = from + step;
				}

				range.update({
					to: val
				});
				break;
		}

		$(this).val(val);

	});

	// fields
	function filled(field) {
		var val = $(field).val().trim();

		if (val.length > 0) {
			$(field).closest('.field').addClass('field_filled');
		} else {
			$(field).closest('.field').removeClass('field_filled');
		}
	}

	$('.field input, .field textarea').each(function() {
		filled(this);
	});

	$(document).on('keydown', '.field input, .field textarea', function() {
		var t = this;
		setTimeout(function() {
			filled(t);
		}, 100)
	});


	$('.toggle').on('click', function(e) {
		e.stopPropagation()
		var content = $(this).parent().find($('.'+$(this).data('toggle')));
		$(this).toggleClass('toggle_close');
		$(content).stop().slideToggle(300);
	});

	$('.filter__block-content').each(function(i, block) {
		var checks = $(block).find('.checkbox').length;

		if (checks > 5) {
			$(block).addClass('filter__block-content_more');
			$(block).append('<span class="filter__block-more">Показать все</span>');
		}
	});

	$('.filter__block-more').on('click', function() {
		$(this).parent().removeClass('filter__block-content_more');
		$(this).remove();
	});

	$('.drop__item').on('click', function() {
		if (!$(this).hasClass('drop__item_link')) {
			$(this).addClass('drop__item_active').siblings().removeClass('drop__item_active');
		}

		$(this).closest('[data-drop]').removeClass('drop-open');
	});

	$(document).on('click', '[data-drop]', function() {

		var data = $(this).data('drop');

		if (data == 'trigger') {
			$('.drop-open').removeClass('drop-open');
			$(this).parent().closest('[data-drop]').addClass('drop-open');
		} else return;

	});

	$(document).on('click', function(e) {

		var drop = $(e.target).parent().closest('[data-drop]').get(0),
				tip = $(e.target).parent().closest('.tip').get(0);

		if ($(e.target).hasClass('counter__btn_plus')) return;

		if (!drop) {
			$('.drop-open').removeClass('drop-open');
		}

		if (!tip) {
			$('.tip__hidecontent').hide();
			$('.container__main').css('z-index', '');
		}

	})

	$('.description__show').on('click', function() {
		$(this).hide();
		$('.description__short').hide();
		$('.description__all').show();
	});

	$('[data-close]').on('click', function(e) {
		e.preventDefault();

		$(this).parent().hide();
		$(this).closest('.card').css('z-index', '');
	});

	$('.tip__name').on('click', function() {
		$('.tip').css('z-index', '');
		$('.container__main').css('z-index', '3');
		$('.card').css('z-index', '');
		$('.tip__hidecontent').hide();
		$(this).parent().find('.tip__hidecontent').show();
		$(this).closest('.card').css('z-index', '2');
		$(this).closest('.tip').css('z-index', '9');
	});

	$('.tip_hover').hover(function() {
		$(this).find('.tip__hidecontent').show();
	}, function() {
		$('.tip__hidecontent').hide();
	});

	// Gallery
	var gId = 0;

	$('.gallery__element').on('click', function() {

		if ($(this).hasClass('gallery__element_video')) {
			var video = $(this).find('video').clone();

			$('.modal_zoom .modal__content').html(video);

			$('.modal_zoom').iziModal('open');

		}
		// else if ($(this).hasClass('gallery__element_file')) {
		// 	var file = $(this).data('file');
		//
		// 	window.open(file, '_blank');
		//
		// 	return false
		// }
		else {
			var img = $(this).find('img').clone(),
					href = $(img).attr('src');

			$(img).attr({
				'id': 'thumb'+gId,
				'data-large-img-url': href,
				'data-large-img-wrapper': 'preview'
			});

			$(this).closest('.gallery').find('.gallery__view').attr('href', href).empty().append(img);

			$(this).closest('.gallery__list').find('.gallery__element_active').removeClass('gallery__element_active');
			$(this).addClass('gallery__element_active');

			$('.gallery__preview').empty();
			m.attach({thumb: '#thumb'+gId});

			gId++;

			$('.gallery__view img').hover(function() {
				$('.gallery__preview').addClass('gallery__preview_hover');
			}, function() {
				$('.gallery__preview').removeClass('gallery__preview_hover');
			});

		}

	});

	$('.vlist_full').each(function(i, list) {
		var show = $(list).data('show'),
				line = $(list).find('.vlist__line:not(.vlist__line_head)').get(show);

		$(line).hide().nextAll(':not(.vlist__line_more)').hide();
	});

	$('.vlist__more').on('click', function() {
		$(this).closest('.vlist').toggleClass('vlist_allshow');
	});

	// Modal

	setTimeout(function() {
		$('[data-modal]').iziModal({
			onClosing: function(r){
				var video = r.$element.find('video').get(0);

				if (video) {
					video.pause();
				}
			}
		});
	}, 1)


	$('[data-open]').on('click', function(e) {
		e.preventDefault();

		var m = $(this).data('open');
		$('[data-modal='+m+']').iziModal('open');
	});


	$('.gallery__view, .shop__slide').on('click', function(e) {
		e.preventDefault();

		var img = $(this).find('img').clone();

		$('.modal_zoom .modal__content').html(img)

		$('.modal_zoom').iziModal('open');
	});


	$('.filter-toggle').on('click', function() {
		$('.filter .toggle:not(.toggle_close)').trigger('click');
		$('.filter').toggle();
	});

	$('.m-menu__toggle').on('click', function() {
		if (!$('.page').hasClass('page_freeze')) {
			const h = $('.m-menu__content').height();
			$('.page').addClass('page_freeze').css('height', h+'px');
			$('html,body').css('overflow-x', 'hidden');

		} else {
			$('.page').removeClass('page_freeze').css('height', '');
			$('html,body').css('overflow', '');
		};

		$(window).scrollTop(0);

		$('.m-menu__content').toggle();
	});

	$('.m-menu__item_drop').on('click', function(e) {
		e.stopPropagation();

		var drop = $(this).find('.m-menu__drop').first(),
				catalog = Boolean($(this).closest('.m-menu__drop_catalog').get(0)) || Boolean($(this).find('.m-menu__drop_catalog').get(0));

		if ($(e.target).parentsUntil('.m-menu__item_drop').length <= 1) {
			$(drop).toggleClass('m-menu__drop_show');

			if (!catalog) {
				const h = $('.m-menu__content').height();
				$('.page').css('height', h);
				return
			}

			if ($(drop).hasClass('m-menu__drop_show')) {
				const h = $(drop).find('.m-menu__list').first().height();
				$('.page').css('height', h);
			} else {
				const h = $(this).closest('.m-menu__list').height();
				$('.page').css('height', h);

			}
		}

	});

	$('.m-menu__back').on('click', function(e) {
		e.stopPropagation();

		$(this).closest('.m-menu__drop_show').removeClass('m-menu__drop_show');

		const h = $('.m-menu__content').height();
		$('.page').css('height', h);
		return
	});

	$('[data-tabs] > *').on('click', function(e) {
		e.preventDefault();

		var data = $(this).parent().data('tabs'),
				index = $(this).index(),
				content = $('[data-tabs-content='+data+']').children().get(index);

		$(content).show().siblings().hide();

		if (!content) {
			$('[data-tabs-content='+data+']').children().hide();
		}

		$(this).addClass('active').siblings().removeClass('active');
	});

	$('.video').on('click', function() {
		var id = $(this).data('id');

		$('#'+id).iziModal('open');
	});

	$('.checkbox input').on('click', function(e) {
		e.stopPropagation();

		$(this).closest('.checkbox').toggleClass('checkbox_active');
	});

	var scrolling,
			toTop = document.querySelector('.to-top');

	document.addEventListener('scroll', function(e) {
		 scrolling = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);

		 if ($(e.target).closest('.results').get(0)) return;

		 if ($(window).width() > 960) {
			 if (scrolling >= 200) {
				 $('.header__fix').addClass('header__fix_show');
				 $('.results').appendTo('.header__fix .search');
			 } else if ($('.header__fix').hasClass('header__fix_show')) {
				 $('.header__fix').removeClass('header__fix_show');
				 $('.results').appendTo('.header__body .search');
			 }
		 } else {
			 if (scrolling >= 31 && !$('.page').hasClass('page_freeze')) {
				 $('.header__mobile').addClass('header__mobile_fix');
			 } else if ($('.header__mobile').hasClass('header__mobile_fix')) {
				 $('.header__mobile').removeClass('header__mobile_fix');
			 }

		 }

		 if (scrolling >= 1000 && windowWidth > 960) {
			 toTop.classList.add('to-top_show');
		 } else {
			 toTop.classList.remove('to-top_show');
		 }
	}, true);

	$('.to-top').on('click', function() {
		$("html, body").stop().animate({scrollTop:0}, 500, 'swing');
	});

	$('.counter__btn_plus').on('click', function(e) {
		e.preventDefault();

		$('.card').css('z-index', '');

		$('.tip__hidecontent').hide();
		$('.tip').css('z-index', '');
		$(this).parent().find('.tip__hidecontent').first().show();
		$(this).closest('.card').css('z-index', '5');
		$(this).parent().find('.tip').css('z-index', '9');

		if ($('.container__side').get(0)) {
			$('.container__main').css('z-index', '3');
		}
	});

	// search
	$('.search__field input').on('click', function() {
		$(this).closest('.search').addClass('search_focus');
		$('.page').append('<div class="fade-bg"></div>');
	});

	$(document).on('click', '.fade-bg', function(e) {
		$('.search').removeClass('search_focus');
		$(this).remove()
	});

	$('button.btn, .counter__btn, .close').on('click', function(e) {
		e.preventDefault();
	})

	$('a[href^="#"]').on('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('href');

    $('html, body').animate({
        scrollTop: $(id).offset().top + $('body').scrollTop() - 80
    }, 1000);

	});

	$('.drop .close').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(this).closest('.drop-open').removeClass('drop-open');
	})

	var heightBottomScroll = 0;

	$('.page__content').nextAll().each(function(i, el) {
		heightBottomScroll += $(el).height();
	});

	// nav index adaptive menu page

	$('.catalog-nav__item').on('click', function(e) {
		if (windowWidth <= 960) {
			const drop = $(e.target).closest('li').find('.drop-nav')[0];

			if (drop) {
				if ($(drop).hasClass('drop-nav_show')) {
					$(drop).removeClass('drop-nav_show');
				} else {
					$(drop).addClass('drop-nav_show');
				}
			}
		}
	});

	$('.drop-nav__item_group').on('click', function(e) {
		if (windowWidth <= 960) {
			const showing = $(this).parent().hasClass('drop-nav__list_show')

			if (showing) {
				$(this).parent().removeClass('drop-nav__list_show')
			} else {
				e.preventDefault();
				$('.drop-nav__list_show').removeClass('drop-nav__list_show')
				$(this).parent().addClass('drop-nav__list_show')
			}
		}
	});

	// sticky cart side

	function stickySide() {
		$('.container__side-scroll').sticky({
			topSpacing: 80,
			bottomSpacing: $('.footer').height() + $('.container__side-scroll').offset().top
		});
	}

	if (windowWidth > 960 && $('.container__side-scroll').get(0)) stickySide();

	$('.description').each(function(i, block) {
		var short = $(block).find('.description__short');
		if ($(short).height() >= 100) {
			$(short).addClass('description__short_gradient');
		}
	})

	init();


})(window);
