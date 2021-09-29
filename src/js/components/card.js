const getCardHTML = card => `<li class = "grid__item">
								<button class="card" data-graph-path="opened-card" data-graph-speed="${storage.settings.disableTransition ? 0 : 300}">
									<span class="card__id visually-hidden">${card.id}</span>
									<h3 class="card__title">${card.title}</h3>
									<p class="card__descr">${card.descr}</p>
									<time class="card__birth">${card.birth}</time>
								</button>
							</li>`

const getCardAll = _ => _io_q('.grid__list').querySelectorAll('.card');

const getLatestData = _ => {
	let cardSet = new Set();

	let cardAll = getCardAll();

	if (cardAll.length > 0) {
		for (let index = 0, length = cardAll.length; index < length; index++) {
			let card = cardAll[index];

			let cardID = card.querySelector('.card__id').textContent
			let cardTitle = card.querySelector('.card__title').textContent
			let cardDescr = normalizeDescr(card.querySelector('.card__descr').innerHTML)
			let cardBirth = card.querySelector('.card__birth').textContent

			let objCard = makeObjCard(cardID, cardTitle, cardDescr, cardBirth);

			cardSet.add(objCard);

			card = null
			cardTitle = null
			cardDescr = null
			cardBirth = null
			cardID = null
		}
	}

	cardAll = null

	return [...cardSet];
}

// ДОБАВЛЕНИЕ КАРТОЧКИ

const addCard = _ => {
	let newCardBirth = getDate()
	let newID = getGeneratedID()

	let newCardData = {
		id: newID,
		title: '',
		descr: '',
		birth: newCardBirth
	}

	let cardHTML = getCardHTML(newCardData);
	let gridList = _io_q('.grid__list')

	gridList.insertAdjacentHTML('afterbegin', cardHTML);

	setTimeout(_ => {
		gridList.querySelector('.grid__item').classList.remove('_adding');
		gridList = null
	}, setDuration(200));

	getOpenedCardID().textContent = newID;
	getOpenedCardBirth().textContent = newCardBirth;

	toggleEditOpenedCard();

	modal.open('opened-card')

	cardHTML = null
}

const deleteCard = id => {
	if (id) {
		let cardAll = getCardAll();

		if (cardAll.length > 0) {
			for (let index = 0, length = cardAll.length; index < length; index++) {
				let card = cardAll[index];
				let cardID = card.querySelector('.card__id');

				if (cardID.textContent === id) {
					let gridItem = card.closest('.grid__item');

					if (gridItem) {
						gridItem.classList.add('_deleting');
						modal.close()

						setTimeout(_ => {
							gridItem.remove();
							gridItem = null
							storage.cardArray = getLatestData()
							API.writeStorage(storage);
						}, setDuration(600));
					}

					card = null
					cardID = null
				}
			}
		}
		focusCard();
		cardAll = null;
	}
}
