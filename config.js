var etc = require('etc')().argv().env();

var configFile = etc.get('config-file');
var configDir = etc.get('config-dir');


if (configDir) {
    etc.folder(configDir);
}
if (configFile) {
    etc.file(configFile);
}

etc.etc().pkg();

var config = etc.toJSON();

module.exports = config;