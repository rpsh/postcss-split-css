'use strict';

const postcss = require('postcss');
const path = require('path');
const fs = require('fs-extra');

module.exports = postcss.plugin('postcss-split-css', (options) => {
    options = options || {};
    options.filter = options.filter || [];

    let removeAtRules = ['font-face', 'import', 'keyframes'];

    let pattern = new RegExp((options.filter.join("|")).replace(/\./g, '\\.'), 'gi');

    return (root) => {

        if (options.filter.length) {
            let newRoot = postcss.parse(root.toString());

            newRoot.walkRules((rule) => {
                let selectors = rule.selectors.filter((selector) => {
                    pattern.lastIndex = 0;
                    return pattern.test(selector);
                });

                if (selectors.length === 0) {
                    rule.parent.removeChild(rule);
                } else {
                    rule.selectors = selectors;
                }
            });

            newRoot.walkAtRules((rule) => {
                let isEmpty = Array.isArray(rule.nodes) && rule.nodes.length === 0,
                    removeByDefault = removeAtRules.indexOf(rule.name) >= 0;

                if (isEmpty || removeByDefault) {
                    rule.parent.removeChild(rule);
                }
            });

            if (options.output) {
                let filePath = path.join(options.output.dist, path.relative(options.output.from, root.source.input.file));

                if (options.output.subfix) {
                    let ext = path.extname(filePath);
                    filePath = filePath.replace(ext, options.output.subfix + ext)
                }

                fs.outputFileSync(filePath, newRoot.toString() + (options.output.append || ''));
            }

            root.walkRules((rule) => {
                let selectors = rule.selectors.filter((selector) => {
                    pattern.lastIndex = 0;
                    return pattern.test(selector);
                });

                if (selectors.length) {
                    rule.parent.removeChild(rule);
                }
            });
        }
    };
});