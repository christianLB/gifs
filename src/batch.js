/*const path = require('path');
const fs = require('fs');

const getFileInfoFromFolder = (route) => {
  const files = fs.readdirSync(route, 'utf8');
  const response = [];
  for (let file of files) {
    console.log(file);
    //const extension = path.extname(file);
    //const fileSizeInBytes = fs.statSync(file).size;
    //response.push({ name: file, extension, fileSizeInBytes });
  }
  return response;
}

const { name, extenstion, fileSizeInBytes } = getFileInfoFromFolder("C:/Users/christian.aguero/Dropbox/gifs");
*/

let Dropbox = require('dropbox');
const fetch = require('node-fetch');

const accessToken = 'SJdjPT5frFwAAAAAAAAAAbA21tOUy5LjuJVSX6M6I9X-ZtvcrO1OqqgW-E8UvqjV';

const files = [];

Dropbox = Dropbox.Dropbox;

const dbx = new Dropbox({  
  accessToken,  
  fetch  
});

const writeFile = (data) => {
  const fs = require('fs');
  const path = `files.json`;

  fs.writeFile (path, data, function(err) {
    if (err) throw err;
    console.log('complete');
  });
}

const getLink = async (path) => {
  const res = await dbx.sharingCreateSharedLink({  
    path: path,  
  }).catch(err => console.log(err));
  return res.url;
}

const getSize = async path => {
  const requestImageSize = require('request-image-size');
 
  const size = await requestImageSize(path)
  .catch(err => console.error(err));
  return size;
}

const getFiles = async () => {
  
  const res = await dbx.filesListFolder({  
    path: '/gifs2',  
  })
  const filteredEntries = res.entries.filter( entry => entry.name.split('.').includes('gif'))
  
  const files = await Promise.all(filteredEntries.map(async entry => {
    let link = await getLink(entry.path_lower);
    link = link.replace('dl=0', 'raw=1');
    link = link.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    const size = await getSize(link);
    
    const allowed = !entry.name.split('.').includes('blocked');

    const file = {name: entry.name, url: link, width: size.width, height:size.height, blocked:!allowed};
    return file;
  })) 
  
  return files;
}

getFiles().then(files => {
  writeFile(JSON.stringify(files));
}).catch(err => console.log(err))



