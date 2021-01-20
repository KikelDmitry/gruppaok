// modal layer
const mLayer = document.querySelector('.modal-layer'),
	html = document.querySelector('html'),
	body = document.querySelector('body');
function mLayerOn() {
	mLayer.classList.add('is-active');
	mLayer.style.visibility = 'visible';
	html.classList.add('modal-open');
	body.classList.add('modal-open');
}
function mLayerOff() {
	mLayer.classList.remove('is-active');
	mLayer.style.visibility = 'hidden';
	html.classList.remove('modal-open');
	body.classList.remove('modal-open');
}

mLayer.addEventListener('click', function (e) {
	if (e.target == this) {
		mClose();
	}
});

function mClose() {
	mLayerOff();
	modalWin.classList.remove('is-active');
	modalWin.setAttribute('aria-hidden', 'true');
	menuWrap.classList.remove('modal-open');
}

// menu open
const burger = document.querySelector('.burger_btn'),
	menuWrap = document.querySelector('.top-menu'),
	menu = document.querySelector('.top-menu__nav'),
	menuLink = document.querySelectorAll('.top-menu__link');
function menuOn() {
	burger.classList.add('is-active');
	menu.classList.add('is-active');
	menuWrap.classList.add('is-active');
	menuWrap.setAttribute('aria-hidden', 'false');
	mLayerOn();
}
function menuOff() {
	burger.classList.remove('is-active');
	menu.classList.remove('is-active');
	menuWrap.classList.remove('is-active');
	menuWrap.setAttribute('aria-hidden', 'true');
	mLayerOff();
}
burger.addEventListener('click', function () {
	if (burger.classList.contains('is-active')) {
		menuOff();
	} else {
		menuOn();
	}
});
menuLink.forEach(function (item) {
	item.addEventListener('click', menuOff);
});

//brands slider
new Glide('.brands__glide', {
	type: 'carousel',
	perView: '7',
	gap: 20,
	autoplay: true,
	animationDuration: 2000,
	animationTimingFunc: 'linear',
	breakpoints: {
		1024: {
			perView: 6
		},
		768: {
			perView: 5
		},
		640: {
			perView: 4,
			gap: 10
		},
		480: {
			perView: 3
		},
		360: {
			perView: 2
		}
	}
}).mount();

new Glide('.photo__slider', {
	type: 'carousel',
}).mount();

//totop
const topBtn = document.querySelectorAll('.js-top');
topBtn.forEach(function (butElem) {
	butElem.addEventListener('click', toTop);
});
function toTop() { //smooth scroll
	const scrollStep = document.body.scrollHeight / 100;
	if (window.pageYOffset > 0) {
		window.scrollBy(0, -(scrollStep));
		setTimeout(toTop, 0);
	} else {
		return false
	}
};
function btnAppear() {
	const topMenu = document.querySelector('.top-menu');
	if (window.pageYOffset > window.innerHeight) {
		topMenu.classList.add('go-down');
	} else {
		topMenu.classList.remove('go-down');
	}
};
window.addEventListener('scroll', btnAppear);