import fs from 'fs';
import camelCase from 'camelcase';

function createContentScript(fileLocation, options) {
  const { js, namespace, name } = options;
  let contentScript;

  if (js) {
    const templateContentScript = [__dirname, '/templates/contentScript.vm'].join('');
    contentScript = fs.readFileSync(templateContentScript, 'utf8');
    contentScript = contentScript.replace(/NAMESPACE/g, namespace);
    contentScript = contentScript.replace(/WIDGET_NAME/g, camelCase(name));
  } else {
    const templateContentScript = [__dirname, '/templates/contentScript.nojs.vm'].join('');
    contentScript = fs.readFileSync(templateContentScript, 'utf8');
  }

  fs.writeFileSync(fileLocation, contentScript);
}

function createJavaScriptFile(fileLocation, options) {
  const { namespace, name } = options;
  const templateJavaScript = [__dirname, '/templates/ui.js'].join('');
  
  let javaScript = fs.readFileSync(templateJavaScript, 'utf8');
  javaScript = javaScript.replace(/NAMESPACE/g, namespace);
  javaScript = javaScript.replace(/WIDGET_NAME/g, camelCase(name));
  fs.writeFileSync(fileLocation, javaScript);
}

function createEmptyfile(fileLocation) {
  fs.writeFileSync(fileLocation);
}

function copyFile(originalFileLocation, newFileLocation) {
  const originalFile = fs.readFileSync(originalFileLocation, 'utf8');
  fs.writeFileSync(newFileLocation, originalFile);
}

function createConfigurationFile(fileLocation) {
  const sampleConfiguration = [__dirname, '/templates/configuration.xml'].join('');
  copyFile(sampleConfiguration, fileLocation);
}

function createWidgetOptions(fileLocation, options) {
  const { name } = options;
  const defaultOptionsFile = [__dirname, '/templates/widget_options.json'].join('');
  const defaultOptions = JSON.parse(fs.readFileSync(defaultOptionsFile, 'utf8'));

  const nameResource = `\${resource:${camelCase(name)}_name}`;
  const descriptionResource = `\${resource:${camelCase(name)}_description}`;
  defaultOptions.name = nameResource;
  defaultOptions.description = descriptionResource;
  defaultOptions.instanceIdentifier = '8d5b1d72ee3d4f789a4ed8d880b00a3a';
  defaultOptions.cssClass = camelCase(name);
  defaultOptions.lastModified = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, 'Z');

  fs.writeFileSync(fileLocation, JSON.stringify(defaultOptions, null, 2));
}

function createLanguageResources(fileLocation, options) {
  const { name } = options;
  const languageResourcesTemplate = [__dirname, '/templates/languageResources.xml'].join('');

  let languageResources = fs.readFileSync(languageResourcesTemplate, 'utf8');
  languageResources = languageResources.replace(/CAMELCASE/g, camelCase(name));
  languageResources = languageResources.replace(/WIDGET_NAME/g, name);
  fs.writeFileSync(fileLocation, languageResources);
}

export default function createWidget(options) {
  const { name, js } = options;
  const widgetDir = name;

  const contentScriptLocation = [widgetDir, '/contentScript.vm'].join('');
  const headerScriptLocation = [widgetDir, '/headerScript.vm'].join('');
  const styleFileLocation = [widgetDir, '/style.less'].join('');
  const widgetOptionsLocation = [widgetDir, '/widget_options.json'].join('');
  const languageResourcesLocation = [widgetDir, '/languageResources.xml'].join('');
  const configurationFileLocation = [widgetDir, '/configuration.xml'].join('');
  const jsFileLocation = [widgetDir, '/ui.js'].join('');

  fs.mkdirSync(widgetDir);

  createEmptyfile(headerScriptLocation);
  createEmptyfile(styleFileLocation);
  createConfigurationFile(configurationFileLocation);

  createContentScript(contentScriptLocation, options);
  createWidgetOptions(widgetOptionsLocation, options);
  createLanguageResources(languageResourcesLocation, options);

  if (js) createJavaScriptFile(jsFileLocation, options);
};