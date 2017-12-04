function createScriptNode(src, async) {
    if(typeof async !== 'boolean') async = false;
    const node = document.createElement('script');
    node.src = src;
    node.async = async;
    document.body.appendChild(node);
}

export {createScriptNode};

function createAnalysisScriptNode(async) {
    createScriptNode('js/analysis.js', async);
}

function createD3ScriptNode(async) {
    createScriptNode('js/d3/d3.js', async);
}

function createD3CloudScriptNode(async) {
    createScriptNode('js/d3.layout.cloud.js', async);
}

function createSigmaScriptNode(async) {
    createScriptNode('js/sigma/sigma.min.js', async);
}

function createSigmaJSONParserScriptNode(async) {
    createScriptNode('js/sigma/plugins/sigma.parsers.json.min.js', async);
}

function createSigmaAnimateScriptNode(async) {
    createScriptNode('js/sigma/plugins/sigma.plugins.animate.js', async);
}

function createSigmaNoOverlapScriptNode(async) {
    createScriptNode('js/sigma/plugins/sigma.layout.noverlap.min.js', async);
}

function createSigmaForceAtlasScriptNode(async) {
    createScriptNode('js/sigma/plugins/sigma.layout.forceAtlas2.min.js', async);
}

function createWordCloudScriptNode(async){
    createScriptNode('js/wordcloud.js', async);
}

export {
    createAnalysisScriptNode,
    createD3ScriptNode,
    createD3CloudScriptNode,
    createSigmaScriptNode,
    createSigmaJSONParserScriptNode,
    createSigmaAnimateScriptNode,
    createSigmaNoOverlapScriptNode,
    createSigmaForceAtlasScriptNode,
    createWordCloudScriptNode
};
