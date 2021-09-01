const componentNameInput = document.getElementById('componentNameInput');
const COMPONENT_NAME_PLACEHOLDER = 'DeloreanDMC';
const jsonInput = document.getElementById('jsonInput');
const JSON_PLACEHOLDER = {
    labelName1: 'OK Griff, I\'ll do it.',
    labelName2: 'Look at the time, you\'ve got less than 4 minutes, please hurry.',
    labelName3: 'Doc, is everything all right, over?',
    labelName4: 'Giddy up, hey, hoot!',
    labelName5: 'Alright, McFly, you\'re asking for it, and now you\'re gonna get it.',
    labelName6: 'I can\'t Emmett, I\'m scared!'
};
const xmlOutput = document.getElementById('xmlOutput');
const importOutput = document.getElementById('importOutput');
const labelsJSONOutput = document.getElementById('labelsJSONOutput');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateMarkup(componentName, labels) {
    const keys = Object.keys(labels);

    const importStatements = [];
    const newLabels = [];
    const labelsJSON = [];
    keys.forEach(key => {
        let value = labels[key];
        let fullName = componentName + capitalize(key);

        newLabels.push(`
<labels>
    <fullName>${fullName}</fullName>
    <categories>${componentName}</categories>
    <language>en_US</language>
    <protected>false</protected>
    <shortDescription>${value.length > 80 ? value.substring(0, 77) + '...' : value}</shortDescription>
    <value>${value}</value>
</labels>`);

        importStatements.push(
            `import ${key} from '@salesforce/label/c.${fullName}';`
        );

        labelsJSON.push(`${key}`);
    });

    if (newLabels.length > 0) {
        let printStringLabels = '';
        newLabels.forEach(label => printStringLabels += label);
        printStringLabels = printStringLabels.substring(1, (printStringLabels.length - 1));
        xmlOutput.innerHTML = printStringLabels;
    }

    if (importStatements.length > 0) {
        let printStringImports = '';
        importStatements.forEach(statement => printStringImports += (statement + '\n'));
        printStringImports = printStringImports.substring(0, (printStringImports.length - 1));
        importOutput.innerHTML = printStringImports;
    }

    if (labelsJSON.length > 0) {
        let printLabelsJSON = 'labels = { \n';
        labelsJSON.forEach((key, index) => {
            printLabelsJSON += `    ${key}${index === (labelsJSON.length - 1) ? '': ','} \n`
        });
        printLabelsJSON += '}'
        labelsJSONOutput.value = printLabelsJSON;
    }
}

function generateLabels() {
    var componentName = componentNameInput.value;
    var json = jsonInput.value;

    if (!componentName || !json) {
        alert('Input is incomplete!');
        return;
    }

    if (!safeParse(json)) {
        alert('Input is not valid JSON');
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
        document.execCommand("copy");
    }
}

async function onload() {
    componentNameInput.setAttribute('placeholder', COMPONENT_NAME_PLACEHOLDER);
    jsonInput.setAttribute('placeholder', JSON.stringify(JSON_PLACEHOLDER, null, 2));
}

window.onload = onload();
