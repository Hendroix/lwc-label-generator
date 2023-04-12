const generateLabelsButton = document.getElementById("generateLabelsButton");
const componentNameInput = document.getElementById("componentNameInput");
const COMPONENT_NAME_PLACEHOLDER = "DeloreanDMC";
const jsonInput = document.getElementById("jsonInput");
const JSON_PLACEHOLDER = {
	labelName1: "OK Griff, I'll do it.",
	labelName2: "Look at the time, you've got less than 4 minutes, please hurry.",
	labelName3: "Doc, is everything all right, over?",
	labelName4: "Giddy up, hey, hoot!",
	labelName5:
		"Alright, McFly, you're asking for it, and now you're gonna get it.",
	labelName6: "I can't Emmett, I'm scared!",
};
const xmlOutput = document.getElementById("xmlOutput");
const importOutput = document.getElementById("importOutput");
const labelsJSONOutput = document.getElementById("labelsJSONOutput");
const labelsJSOutput = document.getElementById("labelsjs");
const sectionGovernor = document.getElementById("sectionGovernor");

function capitalize(str) {
	if (typeof str === "string" && str.length > 0) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	return str;
}

function generateMarkup(componentName, labels) {
	const keys = Object.keys(labels);

	const newLabels = generateXML(componentName, keys, labels);
	if (newLabels.length > 0) {
		xmlOutput.innerHTML = newLabels.join("");
	}

	const importStatements = generateImportStatements(componentName, keys);
	if (importStatements.length > 0) {
		importOutput.innerHTML = importStatements.join("\n");
	}
	const labelsJSON = keys;
	if (labelsJSON.length > 0) {
		labelsJSONOutput.value = `labels = {
    ${labelsJSON.join(",\n    ")}
}`;
	}

	generateLabelsJsFile(importOutput.innerHTML, labelsJSON);
	sectionGovernor.dataset.hasContent = true;
}

function generateXML(componentName, keys, labels) {
	return keys.map((key) => {
		return `
<labels>
	<fullName>${componentName + capitalize(key)}</fullName>
	<categories>${componentName}</categories>
	<language>en_US</language>
	<protected>false</protected>
	<shortDescription>${
		labels[key].length > 80 ? labels[key].substring(0, 77) + "..." : labels[key]
	}</shortDescription>
	<value>${labels[key]}</value>
</labels>`;
	});
}

function generateImportStatements(componentName, keys) {
	return keys.map((key) => {
		return `import ${key} from '@salesforce/label/c.${
			componentName + capitalize(key)
		}';`;
	});
}

function generateLabelsJsFile(importStatments, labels) {
	labelsJSOutput.value = `${importStatments}

export default { ${labels.join(", ")} };`;
}

function generateLabels() {
	var componentName = componentNameInput.value;
	var json = jsonInput.value;

	if (!componentName || !json) {
		alert("Input is incomplete!");
		return;
	}

	if (!safeParse(json)) {
		alert("Input is not valid JSON");
		return;
	}

	try {
		generateMarkup(componentName, safeParse(json));
	} catch (err) {
		console.error(err);
	}
}

function safeParse(jsonBody) {
	try {
		return JSON.parse(jsonBody);
	} catch (error) {
		return false;
	}
}

function copy(id) {
	var copyElement = document.getElementById(id);
	if (copyElement) {
		copyElement.select();
		copyElement.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(copyElement.value);
	}
}

function showSection(sectionId) {
	sectionGovernor.dataset.openSectionId = sectionId;
}

const init = () => {
	generateLabelsButton.addEventListener("click", generateLabels, false);
	componentNameInput.setAttribute("placeholder", COMPONENT_NAME_PLACEHOLDER);
	jsonInput.setAttribute(
		"placeholder",
		JSON.stringify(JSON_PLACEHOLDER, null, 2)
	);

	if (location.hostname === "127.0.0.1") {
		componentNameInput.value = COMPONENT_NAME_PLACEHOLDER;
		jsonInput.innerHTML = JSON.stringify(JSON_PLACEHOLDER, null, 2);
	}
};

init();
