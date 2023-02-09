const Crawler = require("crawler")

/**
 * 
 * @param {string} query
 * @returns [
 *  {
 *      title: string,
 *      vtName: string,
 *      thumbnail: string,
 *      platforms: [string]
 *      year: string
 *  }
 * ]
 */
const searchAlbum = (query) => {
    return new Promise((resolve, reject) => {
        let searchCrawler = new Crawler({
            maxConnections:1,
            callback: (err, res, done) => {
                if(err){
                    reject(err)
                    return done();
                }
                let albums = []
                let $ = res.$;
                $(".albumIcon").each((_i, item) => {
                    let thumbnail = item.children[0]?.children[0]?.attribs?.src || null;
                    let iterator = item.next.next;
                    let albumName = iterator.children[1]?.children[0]?.data;
                    let albumLink = iterator.children[1]?.attribs?.href;

                    iterator = iterator.next.next
                    let platforms = []
                    iterator.children?.map((platform) => {
                        if(platform.attribs && Object.keys(platform.attribs).length !== 0){
                            platforms.push(platform.children[0]?.data)
                        }
                    })

                    iterator = iterator.next.next.next.next;
                    let year = iterator.children[0]?.data
                    let album = {
                        title: albumName,
                        thumbnail: thumbnail,
                        link: albumLink,
                        platforms: platforms,
                        year: year,
                        vtName: albumLink.split('/')[3]
                    }
                    albums.push(album)
                })
                resolve(albums)
                done();
            }
        })
        try{
            searchCrawler.queue({
                uri: `https://downloads.khinsider.com/search?search=${query}`,
            })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 
 * @param {string} album formatted to vtName/uri
 * @returns 
 */
const getAlbumData = (album) => {
    return new Promise((resolve, reject) => {
        let tracksCrawler = new Crawler({
            maxConnections:1,
            callback: (err, res, done) => {
                if(err){
                    reject(err)
                    return done();
                }
                // get images
                let imgs = []
                res.$(".albumImage").find("[href]").each((_i, item) => {
                    imgs.push(item.attribs?.href)
                })
                //get tracks name and internal link
                let tracks = []
                res.$(".clickable-row").not("[align='right']").each((_i, item) => {
                    try{
                        let track = {
                            title: `${item.children[0]?.children[0]?.data}`,
                            links: {
                                ref: `https://downloads.khinsider.com${item.children[0].attribs.href}`
                            }
                        }
                        tracks.push(track)
                    } catch (e) {
                        console.error(e)
                    }
                })
                let album = {
                    albumArt: imgs,
                    tracks: tracks
                }
                resolve(album)
                done();
            }
        })
        try{
            tracksCrawler.queue(`https://downloads.khinsider.com/game-soundtracks/album/${album}`)
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 
 * @param {[links]} innerLinks 
 * @returns [final download links]
 */
const getDownloads = (innerLinks) => {
    return new Promise((resolve, reject) => {
        let dlinks = {}
        let counter = 0
        let downloads = new Crawler({
            maxConnections: 50,
            callback: (err, res, done) => {
                if(err)
                    return done (); 
                let $ = res.$;
                let search = $("#audio")
                dlinks[`https://downloads.khinsider.com${res.req.path}`] = search['0'].attribs.src
                ++counter
                if(counter === innerLinks.length)
                    resolve(dlinks)
                done()
            }
        })
        try{
            downloads.queue(innerLinks)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    searchAlbum,
    getAlbumData,
    getDownloads,
}