"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ipcRenderer, app } from "electron";
import Link from "next/link";

export default function Album() {
	const fetched = useRef<boolean>(false);
	const router = useRouter()
	const {page} = router.query
	const [album, setAlbum] = useState<any>(null);
	const [makeFolder, setMakeFolder] = useState<any>(false);
	const [dlFolder, setdlFolder] = useState<any>("");
	const [getArt, setGetArt] = useState<any>(false);

	const fetchAlbum = (title: string | string[]) => {
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
			tid++;
			return (
				<tr className="divide-y-2 divide-y-reverse">
					<td className="p-4">
						<input
							data-track={track.links.download}
							className="h-4 w-4"
							type="checkbox"
							id={`checkbox ${tid}`}
						/>
					</td>
					<td className="font-bold text-lg">{track.title}</td>
					<td className="px-2">
						<button
							className="btn-default"
							data-track={track.links.download}
							type="button"
							onClick={downloadSingle}
							id={String(tid)}
						>
							Download
						</button>
					</td>
				</tr>
			);
		});
	};

	useEffect(() => {
		if (!fetched.current) 
		fetchAlbum(page);
		ipcRenderer.on("folder", (event, path) => {
			console.log(event, path);
		});
		ipcRenderer
			.invoke("get-folder")
			.then((folder) => setdlFolder(folder))
			.catch((err) => console.error(err));
	}, []);

	const selectDownloadLocation = () => {
		ipcRenderer.send("folder-request");
	};

	const downloadSingle = (e: any) => {
		e.preventDefault();
		downloadWithQuery(e.target.dataset.track);
	};

	const downloadSelected = async (e: any) => {
		e.preventDefault();
		const checkedItems = document.getElementsByTagName("input");
		let checkedTracks = [];
		for (let i = 0; i < checkedItems.length; i++) {
			if (
				checkedItems[i].type == "checkbox" &&
				checkedItems[i].checked == true &&
				checkedItems[i].id != "daa" &&
				checkedItems[i].id != "caf"
			)
				checkedTracks.push(checkedItems[i].dataset.track);
		}
		if(getArt)
			checkedTracks = [...checkedTracks, ...album.albumArt]
		batchDownload(checkedTracks);
	};

	const selectAll = () => {
		const checkboxes = document.getElementsByTagName("input");
		for (let i = 0; i < checkboxes.length; i++) {
			if (
				checkboxes[i].type == "checkbox" &&
				checkboxes[i].id != "daa" &&
				checkboxes[i].id != "caf"
			)
				checkboxes[i].checked = true;
		}
	};

	const downloadWithQuery = (dlLink) => {
		ipcRenderer.send("download", {
			url: dlLink,
			properties: {
				// saveAs: true,
				showProgressBar: true,
			},
		});
	};

	const batchDownload = (tracks) => {
		let path = makeFolder ? `${dlFolder}/${album.name}` : dlFolder;
		let request = {
			path: path,
			tracks: tracks,
		};

		ipcRenderer.send("download-files", request);
	};

	const checkChange = (e: any) => {
		setMakeFolder(e.target.checked);
	};

	const getAlbumData = (e:any) => {
		setGetArt(e.target.checked)
	}

	return (
		<div className="grid">
			<div className="absolute left-10 top-10 h-20 w-30">
				<Link href="/home">
					<a className="btn-default font-bold p-4">Back To Search</a>
				</Link>
			</div>
			<div className="flex p-10 justify-start content-end space-x-4">
				<div className="sm:container mx-auto p-20">
					{album && <img
						className="place-self-start border-4 border-white"
						src={album.albumArt[0]}
					/>}
				</div>
				<div className="container mx-auto">
					<div className="py-4 grid gap-4">
						<button
							id="selAll"
							type="button"
							className="btn-default"
							onClick={selectAll}
						>
							Select All
						</button>
						<button
							onClick={downloadSelected}
							id="downloadAll"
							type="button"
							className="btn-default"
						>
							Download Selected
						</button>
						<div className="py-4 flex gap-4">
							<div className="flex">
								<input onChange={getAlbumData} type="checkbox" id="daa" className="peer hidden" />
								<label htmlFor="daa" className="checkbox-chip">
									Download Album Art
								</label>
							</div>
							<div className="flex">
								<input
									onChange={checkChange}
									type="checkbox"
									id="caf"
									className="peer hidden"
								/>
								<label htmlFor="caf" className="checkbox-chip">
									Create Album Folder
								</label>
							</div>
							<button
								onClick={selectDownloadLocation}
								id="downloadLocation"
								type="button"
								className="btn-default"
							>
								Select Download Folder
							</button>
						</div>
					</div>
					<div>
						<table className="divide-y-4">
							<thead>
								<tr>
									<th>Select</th>
									<th>Title</th>
									<th>Link</th>
								</tr>
							</thead>
							{album && <tbody>{makeTable(album.tracks)}</tbody>}
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
