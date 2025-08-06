/**
 * Formats workflow names to display presentably on cards
 * - Handles names that might overflow
 * - Formats numbers in names to be more readable
 * - Removes excessive special characters
 */
export const formatWorkflowName = (name: string): string => {
	// If name is too long (more than 30 chars), truncate it
	const maxLength = 30;
	let formattedName = name;

	// Remove numbers at the beginning of the name
	formattedName = formattedName.replace(/^[0-9]+/, "");

	// Replace all underscores with spaces
	formattedName = formattedName.replace(/_/g, " ");

	// Replace consecutive numbers with a more readable format
	// e.g., "Workflow123456" becomes "Workflow 123-456"
	formattedName = formattedName.replace(/(\d{3,})/g, (match) => {
		// Format groups of digits with hyphens for readability
		return match.replace(/(\d{3})(?=\d)/g, "$1-");
	});

	// Add spaces between words and numbers if missing
	formattedName = formattedName.replace(/([a-zA-Z])(\d)/g, "$1 $2");
	formattedName = formattedName.replace(/(\d)([a-zA-Z])/g, "$1 $2");

	// Remove excessive special characters and replace with spaces
	formattedName = formattedName.replace(/[_-]{2,}/g, " ");

	// Clean up extra spaces
	formattedName = formattedName.replace(/\s{2,}/g, " ").trim();

	// If empty after all replacements, provide a fallback
	if (!formattedName) {
		formattedName = "Unnamed Workflow";
	}

	// If still too long after formatting, truncate with ellipsis
	if (formattedName.length > maxLength) {
		formattedName = `${formattedName.substring(0, maxLength - 3)}...`;
	}

	return formattedName;
};
