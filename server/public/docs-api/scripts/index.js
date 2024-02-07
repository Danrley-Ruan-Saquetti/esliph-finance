async function App() {
	loadRouters()
}

function loadRouters() {
	const menuWrapperElement = document.querySelector('.sidebar .menu-wrapper')

	const url = new URL(window.location.href)

	const paramRouterName = url.searchParams.get('router')

	const currentRouter = ROUTERS.find(({ name }) => name == paramRouterName) ? paramRouterName : 'home'

	ROUTERS.map(({ title, name }) => {
		const itemElement = document.createElement('a')

		itemElement.setAttribute('data-content-name', name)
		itemElement.innerHTML = title
		itemElement.classList.add('menu-item')
		itemElement.onclick = () => {
			toggleContent(name)
		}

		menuWrapperElement.appendChild(itemElement)

		if (currentRouter == name) {
			toggleContent(name)
		}
	})
}

async function toggleContent(name) {
	toggleContentMenu(name)
	addOrUpdateUrlParam('router', name)
	const result = await getContent(name)

	document.querySelector('main.content-wrapper .content').innerHTML = result.content

	document.title = `Financial Portal - API | ${toCapitalise(name)}`
}

function toggleContentMenu(name) {
	const lastActive = document.querySelector('.sidebar .menu-wrapper .menu-item.active')
	if (lastActive) {
		lastActive.classList.toggle('active', false)
	}

	const currentActive = document.querySelector(`.sidebar .menu-wrapper .menu-item[data-content-name="${name}"]`)

	if (currentActive) {
		currentActive.classList.toggle('active', true)
	}
}

function addOrUpdateUrlParam(name, value) {
	window.history.pushState('object or string', 'Title', `/docs/api/index.html?${name}=${value}`)
}

window.onload = App