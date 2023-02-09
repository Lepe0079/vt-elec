"use client";

import { useEffect, useRef, useState } from "react";
import { testAlbum } from "../../../main/helpers/testVars";
import { ITrack } from "../../components/types";
import TrackTable from "../../components/tracktable";
import Card from "../../components/card";
import { ipcRenderer } from "electron";

export default function Album({ params }: { params: { title: string } }) {
  const fetched = useRef<boolean>(false);
  const [album, setAlbum] = useState<any>(testAlbum);

  const fetchAlbum = (title: string) => {
    fetch(`/api/album/${title}`)
      .then((res) => res.json())
      .then((res) => {
        setAlbum(res);
      })
      .then(() => {
        fetched.current = true;
      })
      .catch((err) => console.error(err));
  };

  const makeTable = (trackList: any) => {
    let tid = -1;
    return trackList.map((track: any) => {
      tid++
      return (
        <tr>
          <td>
            <input type="checkbox" />
          </td>
          <td>{track.title}</td>
          <td>
            {/* <button type="button" onClick={downloadTrack(track)}/> */}
            <button type="button" onClick={handleClick} id={String(tid)}>
              Download
            </button>
            {/* <a href="#" onClick={handleClick} id={String(tid)}>
            
              Download
            </a> */}
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    // if(!fetched.current)
    //     fetchAlbum(params.title)
  }, []);

  const handleClick = (e:any) => {
    e.preventDefault()
    console.log(e.target.id)
    ipcRenderer.send("download", {
      url: `${testAlbum.tracks[e.target.id].links.download}`,
      properties: {directory: ""}
    })

  }

  return (
    <div className="card flex grow justify-start max-w-4xl content-end space-x-4">
        <div className="sm:container pt-5">
            <img
                className="place-self-start"
                src={testAlbum.albumArt[0]}
                width="256"
                height="256"
            />
        </div>
      <div className="lg:container">
        <table className="table-auto">
          <thead>
            <tr>
              <th>Select</th>
              <th>Title</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{makeTable([testAlbum.tracks[0]])}</tbody>
        </table>
      </div>
    </div>
  );
}
