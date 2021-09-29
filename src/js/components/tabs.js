const hideLastTab = _ => {
	let tabActive = _io_q('.sidebar').querySelector('.tab._active')
	let tabContentActive = _io_q('.content').querySelector('.tab-content._active')
	let header = _io_q('.header')
	let headerAdd = header.querySelector('.header__add')
	let headerTitle = header.querySelector('.header__title');
	let headerActions = header.querySelector('.header__actions')
	
	tabActive.classList.remove('_active');
	tabContentActive.classList.remove('_active');

	if (headerTitle.textContent !== "Home") {
		headerAdd.classList.remove('_hidden')
		headerActions.classList.remove('_hidden')
	} else {
		headerAdd.classList.add('_hidden')
		headerActions.classList.add('_hidden')
		nullResult()
		closeSearch()
	}
	
	header = null
	headerAdd = null
	headerTitle = null
	headerActions = null
	tabActive = null
	tabContentActive = null
}

const showTab = tab => {
	let reqTab = _io_q('.sidebar').querySelector(`.tab[data-tab="${tab}"]`)
	let reqTabContent = _io_q('.content').querySelector(`section[data-tab="${tab}"]`)

	reqTab.classList.add('_active')
	reqTabContent.classList.add('_active')

	if (tab === "Home") focusCard();

	window.scrollTo(0, 0);

	reqTab = null
	reqTabContent = null
}

const initTabs = (tab, callback) => {
	tab.addEventListener('click', _ => {
		if (!tab.classList.contains('_active')) {
			hideLastTab();
			showTab(tab.dataset.tab);
			callback()
		}
	});
}
