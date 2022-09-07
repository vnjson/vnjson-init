const fs = require('fs-extra');

const path = require('path');
const color = require('ansi-colors');

const YAML  = require('yaml');


const PATH_CONFIG = path.resolve( process.cwd(), './config.yaml' );


async function changeConfig (projectName){
    const yamlBody = await fs.readFile(PATH_CONFIG, 'utf-8');
    const configBody = YAML.parse(yamlBody);
    configBody.src = projectName;
    await fs.writeFile(PATH_CONFIG, YAML.stringify(configBody), 'utf-8');
}

async function select (projectName){

    try{
        await changeConfig(projectName);
        await fs.remove(path.join(process.cwd(), "public"));
        console.log(`[ select ] ${color.magenta(projectName)}`)
    }
    catch(err){
        throw new Error(err);
    }

}

/**
 * npm run select project-name
 */
select(process.argv[2]);