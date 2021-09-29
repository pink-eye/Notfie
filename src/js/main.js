let storage = {}
let modal = null

document.addEventListener('DOMContentLoaded', _ => {
	API.readStorage(data => {
		Object.assign(storage, JSON.parse(data))

		if (storage.settings.disableTransition)
			toggleTransition(true)

		for (let key in storage.settings) {
			if (key !== "theme") {
				let checkbox = document.querySelector(`#${key}`);

				if (checkbox) {
					checkbox.checked = storage.settings[`${key}`];
					checkbox = null;
				}

			} else {
				let dropdownHead = document.querySelector('.dropdown__head');

				if (dropdownHead) {
					dropdownHead.childNodes[0].data = storage.settings[`${key}`];
					setTheme(storage.settings[`${key}`]);
					dropdownHead = null;
				}
			}
		}

		let cardSet = new Set(storage.cardArray);

		for (let card of cardSet) {
			let cardData = {
				id: card.id,
				title: card.title,
				descr: formatDescrHTML(card.descr),
				birth: card.birth
			}

			let cardHTML = getCardHTML(cardData);

			let gridList = document.querySelector('.grid__list');

			if (gridList) {
				gridList.insertAdjacentHTML('beforeEnd', cardHTML);

				gridList = null
				cardHTML = null
			}
		}

		let preloader = document.querySelector('.preloader')
		preloader.classList.add('_hidden');
		setTimeout(_ => {
			preloader.remove();
			preloader = null
		}, 310)

		focusCard()
	})

	const content = _io_q('.content')
	const sidebar = _io_q('.sidebar')
	const modalEl = _io_q('.modal')
	const header = _io_q('.header')
	const gridList = _io_q('.grid__list')
	const settings = content.querySelector('.settings')

	// BURGER

	initBurger()

	// СЛУШАЕМ КАРТОЧКИ

	gridList.addEventListener('click', e => {
		if (e.target.closest('.card'))
			fillOpenedCard(e.target.closest('.card'))
	});

	// ДОБАВЛЕНИЕ КАРТОЧКИ ПРИ КЛИКЕ

	const btnAdd = header.querySelector('.header__add');

	btnAdd.addEventListener('click', addCard);

	// TABS

	const headerTitle = header.querySelector('.header__title');

	let tabAll = sidebar.querySelectorAll('.tab')

	if (tabAll.length > 0) {
		for (let index = 0, length = tabAll.length; index < length; index++) {
			const tab = tabAll[index];

			initTabs(tab, _ => {
				headerTitle.textContent = tab.dataset.tab;
				setTimeout(closeMenu, setDuration(300));
			})
		}
	} else tabAll = null

	// ИНИЦИАЛИЗЦАЯ МОДАЛЬНОГО ОКНА

	modal = new GraphModal({
		isOpen: _ => {
			autosize(getOpenedCardTitle());
			autosize(getOpenedCardDescr());

			const btnEdit = getOpenedCard().querySelector('.opened-card__edit')
			const btnDelete = getOpenedCard().querySelector('.opened-card__delete')

			btnEdit.addEventListener('click', toggleEditOpenedCard);

			btnDelete.addEventListener('click', _ => {
				deleteCard(getOpenedCardID().textContent)
			});
		},
		isClose: _ => {
			// TIMEOUT ЧТОБЫ КРАСОТУ НЕ ИСПОРИТЬ ПРИ ЗАКРЫТИИ

			setTimeout(_ => {
				saveOpenedCard(getOpenedCardID().textContent);
				clearOpenedCard();
				autosize.destroy(getOpenedCardTitle());
				autosize.destroy(getOpenedCardDescr());
			}, setDuration(300));

			focusCard();
		}
	});

	// header-shell height = header height

	const setHeaderShell = headerHeight => {
		let headerShellAll = content.querySelectorAll('.header-shell');

		if (headerShellAll.length > 0)
			for (let index = 0, length = headerShellAll.length; index < length; index++) {
				let headerShell = headerShellAll[index];

				if (headerShell)
					headerShell.style.setProperty('--header-height', `${headerHeight}px`);
			}

		headerShellAll = null
	}

	let headerHeight = header.offsetHeight
	let lastScrollValue = 0;

	setHeaderShell(headerHeight);

	const ro = new ResizeObserver(_ => {
		let headerHeight = header.offsetHeight;
		setHeaderShell(headerHeight);
	});

	ro.observe(header);

	// СКРЫВАЕТ ШАПКУ ПРИ СКРОЛЛЕ ВНИЗ

	window.addEventListener('scroll', _ => {
		let scrollDistance = window.scrollY;

		if (sidebar.classList.contains('_active')) return

		if (scrollDistance === 0) header.classList.remove('_hidden');

		(scrollDistance > lastScrollValue) ? header.classList.add('_hidden') : header.classList.remove('_hidden');

		lastScrollValue = scrollDistance;
	});

	// ПОИСК

	const search = _io_q('.search')
	const btnSearch = _io_q('.header').querySelector('.header__search')
	const searchField = search.querySelector('.search__field')

	btnSearch.addEventListener('click', toggleSearch);

	searchField.oninput = _ => {
		let value = searchField.value.toLowerCase();

		if (value.length > 0) {
			let cardAll = getCardAll();

			if (cardAll.length > 0) {
				for (let index = 0, length = cardAll.length; index < length; index++) {
					const card = cardAll[index];
					let gridItem = card.closest('.grid__item');

					if (gridItem && !card.textContent.toLowerCase().includes(value))
						gridItem.style.display = 'none';

					gridItem = null
				}
			}

			cardAll = null
		} else nullResult();
	}

	// SHORTCUTS

	document.onkeydown = e => {
		e = e || window.event;

		// ESC
		if (e.keyCode == 27 && search.classList.contains('_opened'))
			closeSearch();

		// CTRL + F
		if (e.ctrlKey && e.keyCode == 70 && !modalEl.classList.contains('is-open'))
			toggleSearch();

		// CTRL + E
		if (e.ctrlKey && e.keyCode == 69 && modalEl.classList.contains('is-open'))
			toggleEditOpenedCard();

		// CTRL + K
		if (e.ctrlKey && e.keyCode == 75) {
			let currentCardID = getOpenedCardID().textContent || document.activeElement.querySelector('.card__id').textContent
			deleteCard(currentCardID)
			currentCardID = null
		}

		// CTRL + N
		if (e.ctrlKey && e.keyCode == 78 && !modalEl.classList.contains('is-open'))
			addCard();

		return true;
	}

	// CHECKBOXS

	const checkboxAll = settings.querySelectorAll('input[type="checkbox"]');

	for (let index = 0, length = checkboxAll.length; index < length; index++) {
		const checkbox = checkboxAll[index];

		checkbox.addEventListener('click', _ => {
			const option = checkbox.id

			checkbox.checked
				? storage.settings[`${option}`] = true
				: storage.settings[`${option}`] = false

			switch (option) {
				case "disableTransition":
					toggleTransition(storage.settings[`${option}`])
					break;
				case "launchAppWhenSystemStarts":
					API.toggleAutoLauncher(storage.settings[`${option}`])
					break;
				case "launchMinimized":
					API.toggleMinimizedLaunch(storage.settings[`${option}`])
					break;
			}

			API.writeStorage(storage);
		});
	}

	// IMPLEMENT IMPORT 

	const importBody = settings.querySelector('.import')
	const importBtn = settings.querySelector('.import__btn')
	const importField = settings.querySelector('.import__field')
	const importTip = settings.querySelector('.import__tip')

	let invalidTip = "I've not found a JSON file.\n Ensure you interacted this area"
	let validTip = "Succesfully! Wait for refresh..."
	let proccessTip = "I've got a"
	let failTip = "Fail... :("

	const validImport = _ => {
		if (!importBody.classList.contains('_valid')) {
			importBody.classList.add('_valid');
			importTip.textContent = validTip
		}
	}

	const invalidImport = tip => {
		if (!importBody.classList.contains('_invalid')) {
			importBody.classList.add('_invalid');
			importTip.textContent = tip
		}
	}

	const readInputFile = async _ => {
		let reader = new FileReader();

		reader.readAsText(importField.files[0]);
		reader.onload = _ => {
			let data = JSON.parse(reader.result)

			if (!data.cardArray && !data.settings)
				invalidImport(failTip);
			else {
				storage = {}
				Object.assign(data, storage)
				storage = data;
				API.writeStorage(storage);
				validImport();
				setTimeout(_ => { location.reload(); }, 3000)
			}
		}
	}

	importField.addEventListener('change', _ => {
		importBody.classList.remove('_valid')
		importBody.classList.remove('_invalid')
		importTip.textContent = `${proccessTip} '${importField.files[0].name}'. You can press 'Import' now`
	});

	importBtn.addEventListener('click', _ => {
		importField.value === '' || (/\.(json)$/i).test(importField.files[0].name) === false
			? invalidImport(invalidTip)
			: readInputFile()
	});

	// DROPDOWN THEME

	const dropdown = settings.querySelector('.dropdown');

	initDropdown(dropdown, params => {
		setTheme(params.btn.textContent);
		storage.settings["theme"] = params.btn.textContent;
		API.writeStorage(storage);
	})


	window.addEventListener('click', e => {
		if (!e.target.closest('.dropdown'))
			hideLastDropdown()
	});
});