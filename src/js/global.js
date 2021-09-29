"use strict"

const cache = (key, value) => {
	if (typeof value == 'undefined')
		return cache[key];

	cache[key] = value;
}

const _io_q = selector => {
	if (!cache(selector))
		cache(selector, document.querySelector(selector));

	return cache(selector);
}

const normalizeDescr = str => str.replaceAll('<br>', '\n')

const formatDescrHTML = str => str.replace(/\n/gi, '<br>')

const makeObjCard = (id, title, descr, birth) => { return { id, title, descr, birth } }

const setDuration = duration => storage.settings.disableTransition ? 0 : duration

const getDate = _ => {
	let nowDate = new Date(),
		nowDay = nowDate.getDate(),
		nowMonth = nowDate.getMonth() + 1,
		nowYear = nowDate.getFullYear();

	return `${nowDay}.${(nowMonth < 10) ? `0${nowMonth}` : nowMonth}.${nowYear}`;
}

const getGeneratedID = _ => {
	let min = Math.ceil(1000),
		max = Math.floor(9999);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setTheme = themeOption => {
	if (themeOption === "Light") theme.setMode("light");
	if (themeOption === "Dark") theme.setMode("dark");
	if (themeOption === "System default") theme.setMode(theme.getSystemScheme());
}

const focusCard = _ => {
	let firstCard = _io_q('.content').querySelector('.card');

	if (firstCard)
		firstCard.focus();

	firstCard = null
}

const toggleTransition = option => {
	let content = _io_q('.content')

	if (option) {
		document.documentElement.style.setProperty('--trns', '0s');
		let cardAll = content.querySelectorAll('button[data-graph-speed="300"]');

		if (cardAll.length > 0) {
			for (let index = 0, length = cardAll.length; index < length; index++) {
				let card = cardAll[index];
				card.dataset.graphSpeed = 0;
			}
			cardAll = null;
		}
	} else {
		document.documentElement.style.setProperty('--trns', '.3s ease');
		let cardAll = content.querySelectorAll('button[data-graph-speed="0"]');

		if (cardAll.length > 0) {
			for (let index = 0, length = cardAll.length; index < length; index++) {
				let card = cardAll[index];
				card.dataset.graphSpeed = 300;
			}
			cardAll = null;
		}
	}

	content = null
}