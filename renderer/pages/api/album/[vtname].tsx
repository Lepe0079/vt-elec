import { NextApiRequest, NextApiResponse } from "next";
import { getAlbumData, getDownloads } from "../../../../main/helpers/simpleCrawler"
import { ITrack } from "../../../components/types"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {vtname} = req.query

    return new Promise((resolve) => {
        if(req.method !== 'GET') {
            res.status(404).json({})
            resolve({})
        }
        getAlbumData(vtname! as string)
        .then((album: any) => {
            const links:[string] = album.tracks.map((track: ITrack) => {
                return track.links.ref
            })
            
            getDownloads(links)
            .then((links) => {
                album.tracks.map((track: ITrack) => {
                    track.links.download = links[track.links.ref]
                })
                res.status(200).json(album)
                resolve(album)
            })
        })

    })
}
