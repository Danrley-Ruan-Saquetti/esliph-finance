async function App() {
	const appElement = document.querySelector('main.content')
	const homeContent = await getContentInHtml('home')

	appElement.innerHTML = homeContent
}

window.onload = App