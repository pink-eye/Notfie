
const toggleSearch = _ => {
	let search = _io_q('.search')
	let btnSearch = _io_q('.header').querySelector('.header__search')
	let searchField = search.querySelector('.search__field')

	search.classList.toggle('_opened');
	btnSearch.classList.toggle('_active');

	if (search.classList.contains('_opened'))
		setTimeout(_ => {
			searchField.focus()
			searchField = null
		}, setDuration(300))
	else {
		searchField.blur()
		searchField = null
	}

	search = null
	btnSearch = null
}

const nullResult = _ => {
	let search = _io_q('.search')
	let searchField = search.querySelector('.search__field')
	let gridItemAll = _io_q('.content').querySelectorAll('.grid__item');

	if (gridItemAll.length > 0) {
		for (let index = 0, length = gridItemAll.length; index < length; index++) {
			let gridItem = gridItemAll[index];
			gridItem.removeAttribute('style');
		}
	}

	if (searchField.value.length > 0)
		searchField.value = ''

	search = null
	searchField = null
	gridItemAll = null
}

const closeSearch = _ => {
	let search = _io_q('.search')
	let btnSearch = _io_q('.header').querySelector('.header__search')
	let searchField = search.querySelector('.search__field')

	if (search.classList.contains('_opened')) {
		search.classList.remove('_opened');
		btnSearch.classList.remove('_active');
		searchField.blur();
		nullResult();
	}

	search = null
	btnSearch = null
	searchField = null
}