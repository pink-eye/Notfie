const getOpenedCard = _ => _io_q('.opened-card')

const getOpenedCardID = _ => _io_q('.opened-card__id')

const getOpenedCardTitle = _ => _io_q('.opened-card__title')

const getOpenedCardDescr = _ => _io_q('.opened-card__descr')

const getOpenedCardBirth = _ => _io_q('.opened-card__birth')

const fillOpenedCard = card => {
	if (card) {
		let cardTitle = card.querySelector('.card__title').textContent
		let cardDescr = card.querySelector('.card__descr').innerHTML
		let cardBirth = card.querySelector('.card__birth').textContent
		let cardID = card.querySelector('.card__id').textContent

		getOpenedCardTitle().value = cardTitle;
		getOpenedCardDescr().value = normalizeDescr(cardDescr);
		getOpenedCardBirth().textContent = cardBirth;
		getOpenedCardID().textContent = cardID;

		cardTitle = null
		cardDescr = null
		cardBirth = null
		cardID = null
	}
}


const toggleEditOpenedCard = _ => {
	if (!getOpenedCard().classList.contains('_editing')) {
		getOpenedCard().classList.add('_editing');
		getOpenedCardTitle().removeAttribute('disabled');
		getOpenedCardTitle().focus();
		getOpenedCardDescr().removeAttribute('disabled');
	} else {
		getOpenedCard().classList.remove('_editing');
		getOpenedCardTitle().disabled = true;
		getOpenedCardDescr().disabled = true;
	}
}

const removeEditOpenedCard = _ => {
	getOpenedCard().classList.remove('_editing');
	getOpenedCardTitle().blur();
	getOpenedCardTitle().disabled = true;
	getOpenedCardDescr().disabled = true;
}

const saveOpenedCard = id => {
	if (id) {
		let newCardTitle = getOpenedCardTitle().value
		let newCardDescr = formatDescrHTML(getOpenedCardDescr().value)

		if (newCardTitle === '' && newCardDescr === '')
			deleteCard(id)
		else {
			let cardAll = getCardAll();

			if (cardAll.length > 0) {
				for (let index = 0, length = cardAll.length; index < length; index++) {
					let card = cardAll[index]
					let cardTitle = card.querySelector('.card__title')
					let cardDescr = card.querySelector('.card__descr')
					let cardBirth = card.querySelector('.card__birth')
					let cardID = card.querySelector('.card__id')

					if (id === cardID.textContent) {
						if (cardTitle.textContent !== newCardTitle
							|| cardDescr.innerHTML !== newCardDescr) {
							cardTitle.textContent = newCardTitle;
							cardDescr.innerHTML = newCardDescr;
							cardBirth.textContent = getDate();
						}
					}

					cardTitle = null
					cardDescr = null
					cardBirth = null
					cardID = null
				}
			}

			cardAll = null;
		}
		removeEditOpenedCard();
		storage.cardArray = getLatestData()
		API.writeStorage(storage);

		newCardTitle = null
		newCardDescr = null
	}
}

const clearOpenedCard = _ => {
	getOpenedCardTitle().value = null;
	getOpenedCardDescr().value = null;
	getOpenedCardBirth().textContent = null;
	getOpenedCardID().textContent = null;
}
