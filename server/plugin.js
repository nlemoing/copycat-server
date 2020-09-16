module.exports = ({ types: t }) => {
    return {
        visitor: {
            JSXElement(path, state) {
                const { changes } = state.opts;
                const { line, column } = path.node.loc.start;
                changes.forEach(({ line: l, column: c, change }) => {
                    if (line !== l || column !== c) {
                        return;
                    }
                    path.node.children = [t.jsxText(change)];
                });
            }
        }
    };
};
