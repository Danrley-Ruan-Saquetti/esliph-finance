async function App() {
	loadRouters()
}

function loadRouters() {
	const menuWrapperElement = document.querySelector('.sidebar .menu-wrapper')

	ROUTERS.map(({ title, name, isActive = false }) => {
		const itemElement = document.createElement('a')

		itemElement.setAttribute('data-content-name', name)
		itemElement.innerHTML = title
		itemElement.classList.add('menu-item')
		itemElement.onclick = () => {
			toggleContent(name)
		}

		menuWrapperElement.appendChild(itemElement)

		if (isActive) {
			toggleContent(name)
		}
	})
}

async function toggleContent(name) {
	toggleContentMenu(name)
	toggleMainContent(name)
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

async function toggleMainContent(name) {
	const content = await getContentInHtml(name)

	document.querySelector('.app .content').innerHTML = content
}

window.onload = App