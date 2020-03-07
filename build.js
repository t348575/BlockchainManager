// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: 'release-builds/blockchain-manager-win32-ia32/',
    // Specify the existing folder where
    outputDirectory: 'installers/',
    // The name of the Author of the app (the name of your company)
    authors: 't348575',
    // The name of the executable of your built
    exe: 'Blockchain-Manager.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
