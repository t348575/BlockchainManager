//  Imports

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');
const bcrypt = require('bcryptjs');
const child_process = require('child_process');
const http = require('http');
const net = require('net');
const ip = require('ip');
const { setIdentity, findPeers, getPeerSet } = require('find-peers');
if(require('electron-squirrel-startup')) return;

//  Electron globals

process.env.NODE_ENV = 'production';
global.win = {};
global.settings = {};
global.nodes = [];
global.isInitialSearchDone = false;
global.isNodeListPopulated = false;
global.unConnectedNodes = [];
global.connectedNodes = [];
global.searchPeersInterval = {};
global.isSearchingForPeers = { 0: true };
global.chain = [];
global.chainLength = 0;
global.isLocalServerReady = false;
global.verified = {};
global.tempNo = 0;
global.TCPByteCount = { count: 0, secondsArray: [{ x: new Date().getTime() / 1000, y: 0}] };
global.HTTPByteCount = { count: 0, secondsArray: [{ x: new Date().getTime() / 1000, y: 0}] };

//  Local globals

let PORT;
let status = '';
let TCPServer, HTTPServer, sendingChainLength;
let blockchain = './resources/blockchain';
let SECRET_KEY, SECRET_KEY_HASH;
let TCPServerClientList = [];
let HTTPServerClientList = [];
let addBlockQueue = [];
let isBlockChainEXERunning = false;
let updateStats, garbageCollect, autoRefreshNodes;

//  Electron
if (handleSquirrelEvent(app)) return;
function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};
createWindow = () => {
    global.win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/assets/icon/icon.png'
    });
    if (process.env.NODE_ENV === 'production') {
        global.win.loadURL(url.format({
            pathname: path.join(__dirname, '/../www/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    else {
        global.win.loadURL('http://localhost:8100');
    }
    global.settings = JSON.parse(getSettings().toString());
    if(global.settings !== -1) {
        SECRET_KEY = global.settings.password;
        SECRET_KEY_HASH = bcrypt.hashSync(global.settings.password, 8);
        PORT = global.settings.port;
        setIdentity({ app: 'blockchainservernode', name: global.settings.name });
        global.nodes = getNodeList('reload');
        httpServer(PORT);
        getChain();
        if(global.nodes !== -1 && global.settings.autoNodeSearch) {
            global.nodes = JSON.parse(getNodeList('reload').toString()).nodes;
            global.isNodeListPopulated = true;
            if(global.nodes.length > 0) {
                global.searchPeersInterval = setInterval(() => {
                    findPeers(global.settings.address, PORT - 1, PORT, global.settings.password, global.settings.timeout < global.settings.searchInterval ? global.settings.timeout : global.settings.searchInterval).then(() => {
                        let tempPeers = getPeerSet();
                        let copy = getNodeList('copy');
                        for (let i = 0, lenCurrentPeers = tempPeers.length; i < lenCurrentPeers; i++) {
                            for (let j = 0, lenCurrentNodes = copy.length; j < lenCurrentNodes; j++) {
                                if (tempPeers[i].name === copy[j].id) {
                                    copy.splice(j, 1);
                                    lenCurrentNodes=copy.length;
                                }
                            }
                        }
                        if (copy.length !== 0)
                            global.unConnectedNodes = copy;
                        for(let v of global.unConnectedNodes) {
                            global.connectedNodes = global.nodes.filter(a => a.id !== v.id);
                        }
                        global.isInitialSearchDone = true;
                        global.win.webContents.send('newPeers', 'newPeers');
                    });
                }, (global.settings.searchInterval + 1) * 1000);
            } else {
                global.isSearchingForPeers[0] = false;
            }
        } else {
            startChainServer();
            win.webContents.send('local-server-ready', 'local-server-ready');
            global.isSearchingForPeers[0] = false;
        }
        intervalsAndPolls();
    }
};
const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    safeExit();
    app.quit();
});
ipcMain.on('stop-searching-auto', (event) => {
    clearInterval(global.searchPeersInterval);
    setTimeout(() => {
        startChainServer();
        win.webContents.send('local-server-ready', 'local-server-ready');
        global.isSearchingForPeers[0] = false;
    }, (global.settings.searchInterval + 1) * 1000);
});
ipcMain.on('stop-chain-server', (event) => {
    clearInterval(sendingChainLength);
    for(let v of TCPServerClientList)
        v.destroy();
    try {
        TCPServer.close();
    }
    catch {}
});
ipcMain.on('stop-finding-nodes', (event, arg) => {
    if(typeof arg === 'undefined')
        arg = 1;
    setTimeout(() => {
        startChainServer();
        win.webContents.send('local-server-ready', 'local-server-ready');
        global.isSearchingForPeers[0] = false;
    }, (arg + 1) * 1000);
});

//  App

restartApp = async () => {
    await safeExit();
    global.settings = {};
    global.nodes = [];
    global.isInitialSearchDone = false;
    global.isNodeListPopulated = false;
    global.unConnectedNodes = [];
    global.connectedNodes = [];
    global.searchPeersInterval = {};
    global.isSearchingForPeers = {0: true};
    global.chain = [];
    global.chainLength = 0;
    global.isLocalServerReady = false;
    global.verified = {};
    global.tempNo = 0;
    global.TCPByteCount = {count: 0, secondsArray: [{x: new Date().getTime() / 1000, y: 0}]};
    global.HTTPByteCount = {count: 0, secondsArray: [{x: new Date().getTime() / 1000, y: 0}]};
    status = '';
    blockchain = './blockchain';
    TCPServerClientList = [];
    HTTPServerClientList = [];
    addBlockQueue = [];
    isBlockChainEXERunning = false;
    app.relaunch();
    app.exit();
};
findNodes = (searchTime) => {
    findPeers(global.settings.address, PORT - 1, PORT, global.settings.password, searchTime).then(() => {
        let peerSet = getPeerSet();
        let copy = getNodeList();
        for (let i = 0, lenCurrentPeers = peerSet.length; i < lenCurrentPeers; i++) {
            for (let j = 0, lenCurrentNodes = copy.length; j < lenCurrentNodes; j++) {
                if (peerSet[i].name === copy[j].id) {
                    peerSet.splice(j, 1);
                    lenCurrentNodes=peerSet.length;
                }
            }
        }
        win.webContents.send('find-nodes', peerSet);
    });
};
refreshNodes = () => {
    if (!global.isNodeListPopulated) {
        const temp = getNodeList();
        if (temp === -1)
            return;
        global.nodes = JSON.parse(temp.toString()).nodes;
    }
    global.unConnectedNodes = getNodeList('copy');
    let count = 0;
    for(let v of global.nodes) {
        let options = {
            hostname: v.ip,
            port: PORT + 1,
            path: encodeGetParams({ request: 'refresh', name: global.settings.name, key: SECRET_KEY_HASH}),
            timeout: global.settings.timeout * 1000,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let conn = http.get(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            let error;
            if (statusCode !== 200) {
                count++;
                if (count === global.nodes.length)
                    win.webContents.send('newPeers', 'newPeers');
            } else if (!/^application\/json/.test(contentType)) {
                count++;
                if (count === global.nodes.length)
                    win.webContents.send('newPeers', 'newPeers');
            }
            if (!error) {
                res.setEncoding('utf8');
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        data = JSON.parse(data);
                        if (data.hasOwnProperty('id') && data.hasOwnProperty('ip') && data.hasOwnProperty('key') && bcrypt.compareSync(SECRET_KEY, data.key)) {
                            count++;
                            if (count === global.nodes.length)
                                win.webContents.send('newPeers', 'newPeers');
                            global.unConnectedNodes = unConnectedNodes.filter(obj => obj.name === data.id);
                            for(let v of global.unConnectedNodes) {
                                global.connectedNodes = global.nodes.filter(a => a.id !== v.id);
                            }
                        }
                        count++;
                        if (count === global.nodes.length)
                            win.webContents.send('newPeers', 'newPeers');
                    }
                    catch {
                        count++;
                        if (count === global.nodes.length)
                            win.webContents.send('newPeers', 'newPeers');
                    }
                });
            } else {
                count++;
                if (count === global.nodes.length)
                    win.webContents.send('newPeers', 'newPeers');
            }
        });
        conn.on('error', (e) => {
            count++;
            if (count === global.nodes.length)
                win.webContents.send('newPeers', 'newPeers');
        });
        conn.on('timeout',  () => {
            count++;
            if (count === global.nodes.length)
                win.webContents.send('newPeers', 'newPeers');
        });
    }
};
intervalsAndPolls = () => {
    updateStats = setInterval(() => win.webContents.send('update-stats'), 1000);
    garbageCollect = setInterval(garbageCollector, 10000);
    if(global.settings.autoRefreshNodes)
        autoRefreshNodes = setInterval(refreshNodes, (global.settings.timeout + 1) * 1000);
};
updateDataStats = (len, mode) => {
    switch (mode) {
        case 'tcp': {
            global.TCPByteCount.count += len;
            const now = new Date().getTime() / 1000;
            let index = global.TCPByteCount.secondsArray.findIndex(a => {
                if (a.x >= now - 3 && a.x <= now + 3)
                    return true;
            });
            if (index !== -1 ) {
                global.TCPByteCount.secondsArray[index].x = now;
                global.TCPByteCount.secondsArray[index].y += len;
            } else {
                global.global.TCPByteCount.secondsArray.push({ x: now, y: len });
            }
            break;
        }
        case 'http': {
            global.HTTPByteCount.count += len;
            const now = new Date().getTime() / 1000;
            let index = global.HTTPByteCount.secondsArray.findIndex(a => {
                if (a.x >= now - 3 && a.x <= now + 3)
                    return true;
            });
            if (index !== -1 ) {
                global.HTTPByteCount.secondsArray[index].x = now;
                global.HTTPByteCount.secondsArray[index].y += len;
            } else {
                global.global.HTTPByteCount.secondsArray.push({ x: now, y: len });
            }
            break;
        }
    }
};
garbageCollector = () => {
    if(!isBlockChainEXERunning && tempNo > 0) {
        isBlockChainEXERunning = true;
        for(let i=1; i<=tempNo; i++) {
            fs.unlinkSync(`temp${i}.aes`)
        }
    }
};
safeExit = () => {
    clearInterval(updateStats);
    clearInterval(sendingChainLength);
    clearInterval(global.searchPeersInterval);
    garbageCollector();
    clearInterval(garbageCollect);
    for(let v of TCPServerClientList)
        v.destroy();
    try {
        TCPServer.close();
    }
    catch {}
    try {
        HTTPServer.close();
    }
    catch {}
};
getGenStats = () => { return { HTTPByteCount: global.HTTPByteCount.count, TCPByteCount: global.TCPByteCount.count, chainLength: global.chainLength, nodeCount: global.connectedNodes.length } };
encodeGetParams = (p) => Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

//  IO

getSettings = () => { if (fs.existsSync('settings.json')) return fs.readFileSync('settings.json'); else return -1; };
checkSettings = () => { return fs.existsSync('settings.json'); };
createSettings = (settings) => {
    settings.timeout = 10;
    settings.name = '_' + Math.random().toString(36).substr(2, 12);
    settings.searchInterval = 5;
    settings.autoNodeSearch = true;
    settings.autoRefreshNodes = false;
    fs.writeFileSync('settings.json', JSON.stringify(settings), { encoding: 'utf-8' });
    restartApp();
};
saveNodes = (nodes) => {
    fs.readFile('nodes.json', function (err, data) {
        let json;
        try {
            json = JSON.parse(data.toString());
        } catch {
            json = {};
            json.nodes = [];
        }
        for(let v of nodes) {
            let node = {};
            node.id = v.name;
            node.ip = v.ip;
            node.chainLength = 0;
            node.givenBlocks = 0;
            node.contributedBlocks = 0;
            json.nodes.push(node);
        }
        fs.writeFile("nodes.json", JSON.stringify(json), { flag: 'w+' }, () => {});
    })
};
updateSettings = (toUpdate) => {
    let modified = false;
    if(fs.existsSync('settings.json')) {
        let currentSettings = JSON.parse(fs.readFileSync('settings.json').toString());
        for(let v in toUpdate) {
            if(currentSettings[v] !== toUpdate[v]) {
                currentSettings[v] = toUpdate[v];
                modified = true;
            }
        }
        if(modified) {
            fs.writeFileSync('settings.json', JSON.stringify(currentSettings), { flag: 'w+' });
            restartApp();
        }
    }
};
addToChain = (data) => {
    global.chain.push(data);
    global.chainLength++;
    fs.writeFileSync('chain.aes', global.chain[global.chainLength - 1].toString(), { flag: 'a' });
};
getChain = () => {
    if(fs.existsSync('chain.aes')) {
        const lineReader = require('readline').createInterface({ input: require('fs').createReadStream('chain.aes') });
        lineReader.on('line', (line) => {
            try {
                global.chain.push(line);
                global.chainLength++;
            } catch {}
        });
    } else
        return -1;
};
saveEditedNode = (name, newIp) => {
    if(fs.existsSync('nodes.json')) {
        let nodes = JSON.parse(fs.readFileSync('nodes.json').toString()).nodes;
        for(let v of nodes) {
            if(v.id === name) {
                v.ip = newIp;
                break;
            }
        }
        fs.writeFileSync('nodes.json', JSON.stringify({ nodes: nodes }), { flag: 'w+' });
    }
};
deleteNode = (name) => {
    if(fs.existsSync('nodes.json')) {
        let nodes = JSON.parse(fs.readFileSync('nodes.json').toString()).nodes;
        nodes = nodes.filter(a => a.id !== name);
        fs.writeFileSync('nodes.json', JSON.stringify({ nodes: nodes }), { flag: 'w+' });
    }
};
addNode = (ip, name) => {
    if(fs.existsSync('nodes.json')) {
        let nodes = JSON.parse(getNodeList('reload').toString()).nodes;
        nodes.push({ id: name, ip: ip, chainLength: 0, givenBlocks: 0, contributedBlocks: 0 });
        fs.writeFileSync('nodes.json', JSON.stringify({ nodes: nodes }), { flag: 'w+' });
    } else {
        let nodes = [];
        nodes.push({ id: name, ip: ip, chainLength: 0, givenBlocks: 0, contributedBlocks: 0 });
        fs.writeFileSync('nodes.json', JSON.stringify({ nodes: nodes }), { flag: 'w+' });
    }
};
getNodeList = (option) => {
    if(option === 'reload' && fs.existsSync('nodes.json'))
        return fs.readFileSync('nodes.json');
    else if (option === 'copy' && global.isNodeListPopulated) {
        let result = [];
        for (let i = 0; i < global.nodes.length; i++)
            result.push(global.nodes[i]);
        return result;
    }
    else if(option === 'reSeed' && fs.existsSync('nodes.json')) {
        global.nodes = JSON.parse(fs.readFileSync('nodes.json').toString()).nodes;
    }
    else if (global.isNodeListPopulated)
        return global.nodes;
    else if (fs.existsSync('nodes.json'))
        return fs.readFileSync('nodes.json');
    else return -1;
};

//  BlockChain functions

startChainServer = () => {
    if(process.platform === 'win32') {
        blockchain = 'resources/blockchain.exe';
    }
    TCPServerForChain(PORT);
    sendingChainLength = setInterval(() => {
        for(let peer of global.connectedNodes) {
            sendChainLength(peer.ip);
        }
    }, global.settings.searchInterval * 1000);
};
addBlock = (data) => {
    let shouldRun = false;
    let currentID;
    if(data !== 'redo') {
        currentID = '_' + Math.random().toString(36).substr(2, 12);
        data.identity = currentID;
        addBlockQueue.push(data);
    }
    if (addBlockQueue.length > 1) {
        if(isBlockChainEXERunning) {
            setTimeout(() => addBlock('redo'), 1000);
        } else {
            shouldRun = true;
            data = addBlockQueue[0];
            currentID = data.identity;
        }
    } else {
        shouldRun = true;
        currentID = addBlockQueue[0].identity;
        data = addBlockQueue[0];
    }
    if(shouldRun) {
        isBlockChainEXERunning = true;
        let options = [];
        if(global.chain.length === 0)
            options.push('-min', '-index', '1', '-data', data.inData, '-difficulty', data.difficulty, '-prevhash', data.prev_hash, '-onlygenesis', '-genesis');
        else
            options.push('-min', '-addblock', '-path', 'cin', '-newdata', data.inData);
        runBlockChain(options).then((data) => {
            addBlockQueue = addBlockQueue.filter(obj => obj.identity !== currentID);
            try {
                let blockData = JSON.parse(data.scriptOutput);
                if(blockData.hasOwnProperty('data') && blockData.hasOwnProperty('difficulty') && blockData.hasOwnProperty('hash') && blockData.hasOwnProperty('index') && blockData.hasOwnProperty('nonce') && blockData.hasOwnProperty('prevhash') && blockData.hasOwnProperty('timestamp')) {
                    if(blockData.data.length > 0 && blockData.hash.length === 64 && blockData.prevhash.length === 64) {
                        addToChain(data.scriptOutput);
                        isBlockChainEXERunning = false;
                    }
                    else {
                        if (data.client) {
                            data.client.write(JSON.stringify({ request: 'failedBlock', data: data.scriptOutput }));
                        } else {
                            console.log(JSON.stringify({ request: 'failedBlock', data: data.scriptOutput }));
                        }
                        isBlockChainEXERunning = false;
                    }
                }
                else if (data.client) {
                    data.client.write(JSON.stringify({ request: 'failedBlock', data: data.scriptOutput }));
                } else {
                    console.log(JSON.stringify(console.log({ request: 'failedBlock', data: data.scriptOutput })));
                }
                isBlockChainEXERunning = false;
            }
            catch {
                if(data.client) {
                    data.client.write(JSON.stringify({ request: 'failedBlock', data: data.scriptOutput, exitCode: data.exitCode }));
                } else {
                    console.log(JSON.stringify({ request: 'failedBlock', data: data.scriptOutput, exitCode: data.exitCode }));
                }
                isBlockChainEXERunning = false;
            }
        }).catch(() => {
            addBlockQueue = addBlockQueue.filter(obj => obj.identity !== currentID);
            isBlockChainEXERunning = false;
        });
    }
};
TCPServerForChain = (PORT) => {
    TCPServer = net.createServer((client) => {
        client.on('data', (data) => {
            updateDataStats(data.toString().length, 'tcp');
            try {
                data = JSON.parse(data.toString());
                if(bcrypt.compareSync(SECRET_KEY, data.key) && data.request) {
                    switch(data.request) {
                        case 'getStatus': {
                            client.write(JSON.stringify({ key: SECRET_KEY_HASH, status: status }));
                            client.end();
                            break;
                        }
                        case 'sendChainLength': {
                            if(data.chainLength > chainLength) {
                                console.log(`longer chain found at ${client.remoteAddress}`);
                                requestLastNBlocks(client.remoteAddress,data.chainLength - chainLength, data.latestIndex);
                            }
                            break;
                        }
                        case 'getBlock': {
                            let sendingChain = [];
                            for(let i = data.index - data.N; i<data.index; i++)
                                sendingChain.push(global.chain[i]);
                            //console.log(data.index - data.N, data.index);
                            client.write(JSON.stringify({ subChain: sendingChain, key: SECRET_KEY_HASH }), () => client.end());
                            break;
                        }
                        case 'addBlock': {
                            data.client = client;
                            addBlock(data);
                            break;
                        }
                    }
                }
            } catch(err) {
                console.log('Error!');
                console.log(err.stack);
            }
        });
    }).listen(PORT);
    TCPServer.on("error", (err) => {
        console.log("Caught flash policy server socket error: ");
        console.log(err.stack);
    });
    TCPServer.on('connection', (socket) => {
        TCPServerClientList.push(socket);
        socket.on('close', () => {
            TCPServerClientList.splice(TCPServerClientList.indexOf(socket), 1);
        });
    });
};
httpServer = (PORT) => {
    HTTPServer = http.createServer( (req, res) => {
        if(global.settings !== -1) {
            let args = url.parse(req.url, true).query;
            updateDataStats(JSON.stringify(args).length, 'http');
            switch(args.request) {
                case 'refresh': {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ id: global.settings.name, ip: ip.address(), key: SECRET_KEY_HASH }));
                    break;
                }
                case 'addBlock': {
                    if(bcrypt.compareSync(SECRET_KEY, args.key)) {
                        addBlock(JSON.parse(JSON.stringify(args)));
                    }
                }
            }
        }
        res.end();
    }).listen(PORT + 1);
};
getNodeState = (IP) => {
    return new Promise((resolve) => {
        const client = net.createConnection({ host: IP, port: PORT },  () => {
            client.write(JSON.stringify({ request: 'status' }), () => {
                client.on('data', (data) => {
                    updateDataStats(data.toString().length, 'tcp');
                    client.end();
                    resolve(data.toString());
                })
            });
        });
    });
};
sendChain = (IP) => {
    return new Promise((resolve) => {
        const client = net.createConnection({ host: IP, port: PORT }, () => {
            client.write(JSON.stringify({ request: 'giveChain', chain: getChain(), chainLength: chainLength }), () => client.end());
        });
    });
};
sendChainLength = (IP) => {
    return new Promise((resolve) => {
        const client = net.createConnection(PORT, IP,  () => {
            let index;
            if(chainLength === 0)
                index = 0;
            else
                index = JSON.parse(global.chain[global.chain.length - 1]).index;
            client.write(JSON.stringify({ request: 'sendChainLength', key: SECRET_KEY_HASH, chainLength: chainLength, latestIndex: index}), () => client.end());
        });
    });
};
runBlockChain = (OPTIONS, callback) => {
    return new Promise((resolve) => {
        let cin = false;
        if(OPTIONS.indexOf('cin') !== -1)
            cin = true;
        let child = child_process.spawn(blockchain, OPTIONS);
        let scriptOutput = '';
        child.stdout.setEncoding('utf8');
        if(cin)
            child.stdin.write(global.chain[global.chain.length - 1].toString() + '\n');
        child.stdout.on('data', (data) => {
            data=data.toString();
            scriptOutput += data;
        });
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (data) => {
            data = data.toString();
            scriptOutput += data;
        });
        child.on('close', (code) => {
            if(callback)
                callback(scriptOutput, code);
            resolve({ scriptOutput: scriptOutput, exitCode: code});
        });
    })
};
requestLastNBlocks = (IP, N, index) => {
    return new Promise((resolve) => {
        const client = net.createConnection({ host: IP, port: PORT },  () => {
            client.write(JSON.stringify({ request: 'getBlock', key: SECRET_KEY_HASH, N: N, index: index }), () => {
                console.log(`requested chain found at ${client.remoteAddress}`);
                client.on('data', (data) => {
                    updateDataStats(data.toString().length, 'tcp');
                    console.log(`recieved chain found at ${client.remoteAddress}`);
                    try {
                        data = JSON.parse(data);
                        for(let block of data.subChain) {
                            try {
                                let blockData = JSON.parse(block);
                                if(blockData.hasOwnProperty('data') && blockData.hasOwnProperty('difficulty') && blockData.hasOwnProperty('hash') && blockData.hasOwnProperty('index') && blockData.hasOwnProperty('nonce') && blockData.hasOwnProperty('prevhash') && blockData.hasOwnProperty('timestamp')) {
                                    if(blockData.data.length > 0 && blockData.hash.length === 64 && blockData.prevhash.length === 64) {
                                        addToChain(data.scriptOutput);
                                        console.log(blockData);
                                        console.log(`chain from ${client.remoteAddress} successfully added`);
                                    }
                                }
                            }
                            catch(err) {
                                console.log('parse error');
                            }
                        }
                    }
                    catch(err) {
                        console.log('parse error');
                    }
                });
            });
        });
    });
};
verifyChain = (chain, num) => {
    fs.openSync(`temp${num}.aes`, 'w+');
    for (let v of chain)
        fs.writeFileSync(`temp${num}.aes`, v, { flag: 'a' });
    isBlockChainEXERunning = true;
    runBlockChain(['-verify', '-path', `temp${tempNo}.aes`]).then((data) => {
        isBlockChainEXERunning = false;
        console.log(data.scriptOutput);
        if(data.scriptOutput === 'Verified!\n' || data.scriptOutput === 'Verified!\r\n')
            win.webContents.send('verify-chain', num);
        else
            win.webContents.send('verify-chain', 'false');
    }).catch(() => {
        isBlockChainEXERunning = false;
    });
};
getTempNo = () => { return ++global.tempNo; };
