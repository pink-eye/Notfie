const toggleMenu = _ => {
	let burger = _io_q('.header').querySelector('.burger');
	burger.classList.toggle('_active');
	_io_q('.sidebar').classList.toggle('_active');

	burger = null
}

const closeMenu = _ => {
	let burger = _io_q('.header').querySelector('.burger');
	burger.classList.remove('_active');
	_io_q('.sidebar').classList.remove('_active');

	burger = null
}

const initBurger = _ => {
	const burger = _io_q('.header').querySelector('.burger');
	
	burger.addEventListener('click', toggleMenu);
}
