const {remote} = require('electron'); 
const fs = require('fs');

const nativeTheme = remote.nativeTheme; 

function loadCSS(shouldUseDarkColors) { 
    var head = document.getElementById("theme");
    
    var theme = shouldUseDarkColors ? "dark.css" : "light.css"

    head.setAttribute("href", "assets/" + theme)
    console.log(head)
} 

loadCSS(nativeTheme.shouldUseDarkColors);
nativeTheme.on("updated", () => { 
  loadCSS(nativeTheme.shouldUseDarkColors); 
}); 

window.onload = () => {
  var files = remote.dialog.showOpenDialogSync({
    properties: ['openFile'],
    title: 'Select users',
    filters: [
      { name: 'Text files', extensions: ['txt'] }
    ]
  })
  
  if (files !== undefined && files.length == 1) {
    fs.readFile(files[0], 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }

      var users = data.toString().split("\n")
        .map(line => line.trim())
        .filter(line => !!line);

      createWheel(users);
  });
  }
}
