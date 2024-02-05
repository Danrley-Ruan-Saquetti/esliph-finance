const md = markdownit()

async function getContentInHtml(name) {
	const result = await getContent(name)

	if (!result.ok) {
		throw new Error(result.error)
	}

	const content = converterMarkdownToHtml(result.content)

	return content
}

async function getContent(name) {
	try {
		const result = await fetch(`/docs-api/content/${name}.md`).then(res => res.text())

		return { ok: true, content: result, error: null }
	} catch (err) {
		console.log(err)

		return { ok: false, content: 'Not Found', error: err }
	}
}

function converterMarkdownToHtml(content) {
	return md.render(content)
}