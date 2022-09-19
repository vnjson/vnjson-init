const fs = require('fs-extra');
const extractZIP = require('extract-zip');
const path = require('path');
const color = require('ansi-colors');
const request = require('request');

// updateUrl
/**
 * PATH
 */
 const YAML  = require('yaml')


 const configGlobal = YAML.parse(fs.readFileSync(path.resolve(process.cwd()+'/config.yaml'), 'utf8'))
 
const URL_SRC = configGlobal.updateSrc?.url||'https://github.com/vnjson/mcap/archive/refs/heads/main.zip';
const PATH_ZIP = path.join(process.cwd() , "src.zip");
const PATH_UPLOAD_SRC = path.join(process.cwd(), (configGlobal.updateSrc?.dir||'mcap-main') +'/src');
/**
 * ACTIONS
 */
async function getZIP (URL_SRC, PATH_ZIP){
    return new Promise( (resolve, reject) => {
        request(URL_SRC)
            .pipe( fs.createWriteStream(PATH_ZIP) )
            .on('close',  async (err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve();
                }
            });
    });
}


async function init (projectName){
    console.log('[ download ] '+ color.yellow(URL_SRC))
    try{
        // удаляю src.zip
        await fs.remove(PATH_ZIP);
        // получаю архив проекта с github
        await getZIP(URL_SRC, PATH_ZIP);
        // распаковываю архив
        await extractZIP(PATH_ZIP, { dir: process.cwd() })
        // удаляю архив
        await fs.remove(PATH_ZIP);
        // копирую из каталок ./src в корень проекта
        await fs.copy(PATH_UPLOAD_SRC, projectName);
        await fs.remove(path.join(process.cwd(), configGlobal.updateSrc?.dir||'mcap-main'));
        await fs.remove(path.join(process.cwd(), "public"));

    }
    catch(err){
        throw new Error(err);
    }

}

/**
 * npm run init project-name
 */
init(process.argv[2]);

