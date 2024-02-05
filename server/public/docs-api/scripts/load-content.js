async function getContent(name) {
	try {
		const result = await fetch(`/docs/api/content/${name}`).then(res => res.json())

		return { ok: true, content: result.value.content, error: null }
	} catch (err) {
		console.log(err)

		return { ok: false, content: 'Not Found', error: err }
	}
}