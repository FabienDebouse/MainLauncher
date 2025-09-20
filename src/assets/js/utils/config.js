/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */

const pkg = require('../package.json');
const nodeFetch = require("node-fetch");
const convert = require('xml-js');
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;
let news = `${url}/launcher/news-launcher/news.json`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            nodeFetch(config).then(async config => {
                if (config.status === 200) return resolve(config.json());
                else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
            }).catch(error => {
                return reject({ error });
            })
        })
    }

    async getInstanceList() {
        let urlInstance = `${url}/files`
        let instances = await nodeFetch(urlInstance).then(res => res.json()).catch(err => err)
        let instancesList = []
        instances = Object.entries(instances)

        for (let [name, data] of instances) {
            let instance = data
            instance.name = name
            instancesList.push(instance)
        }
        return instancesList
    }

    async getNews() {
        let config = await this.GetConfig() || {}
        
        console.log('DEBUG: getNews called');
        console.log('DEBUG: config.rss:', config.rss);
        console.log('DEBUG: news URL:', news);

        if (config.rss) {
            return new Promise((resolve, reject) => {
                nodeFetch(config.rss).then(async config => {
                    if (config.status === 200) {
                        let news = [];
                        let response = await config.text()
                        response = (JSON.parse(convert.xml2json(response, { compact: true })))?.rss?.channel?.item;

                        if (!Array.isArray(response)) response = [response];
                        for (let item of response) {
                            console.log('DEBUG: Processing item:', item);
                            console.log('DEBUG: item.title:', item.title);
                            console.log('DEBUG: item content:encoded:', item['content:encoded']);
                            console.log('DEBUG: item dc:creator:', item['dc:creator']);
                            
                            // Handle CDATA content properly
                            let content = '';
                            if (item['content:encoded']) {
                                if (item['content:encoded']._cdata) {
                                    content = item['content:encoded']._cdata;
                                } else if (item['content:encoded']._text) {
                                    content = item['content:encoded']._text;
                                } else if (typeof item['content:encoded'] === 'string') {
                                    content = item['content:encoded'];
                                }
                            }
                            
                            news.push({
                                title: item.title?._text || item.title,
                                content: content,
                                author: item['dc:creator']?._text || item['dc:creator'],
                                publish_date: item.pubDate?._text || item.pubDate
                            })
                        }
                        return resolve(news);
                    }
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => reject({ error }))
            })
        } else {
            console.log('DEBUG: Using JSON news, fetching:', news);
            return new Promise((resolve, reject) => {
                nodeFetch(news, {
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                    }
                }).then(async config => {
                    console.log('DEBUG: Response status:', config.status);
                    if (config.status === 200) {
                        const text = await config.text();
                        console.log('DEBUG: Raw text:', text);
                        try {
                            const jsonData = JSON.parse(text);
                            console.log('DEBUG: News data:', jsonData);
                            return resolve(jsonData);
                        } catch (parseError) {
                            console.error('DEBUG: JSON parse error:', parseError);
                            return reject({ error: parseError });
                        }
                    }
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => {
                    console.error('DEBUG: Error fetching news:', error);
                    return reject({ error });
                })
            })
        }
    }
}

export default new Config;