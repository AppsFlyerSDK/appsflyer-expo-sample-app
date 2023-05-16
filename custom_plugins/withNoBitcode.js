const { withXcodeProject } = require('@expo/config-plugins');


module.exports = function withNoBitcode(config) {
    return withXcodeProject(config, async (config) => {

        const xcodeProject = config.modResults;
        xcodeProject.addBuildProperty('ENABLE_BITCODE', 'NO');

        return config;
    });
}
