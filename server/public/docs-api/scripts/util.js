function toCapitalise(text, firstOccurrenceOnly = true) {
	if (firstOccurrenceOnly) {
		return text[0].toUpperCase() + text.substring(1) + ''
	}

	return text
		.split(' ')
		.map(word => toCapitalise(word))
		.join(' ') + ''
}