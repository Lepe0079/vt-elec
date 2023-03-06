import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/card";

export default function HomePage() {
	const [search, setSearch] = useState<string>("");
	const [albums, setAlbums] = useState<any>([]);

	useEffect(() => {}, [search]);

	const handleChange = (e: any) => {
		setSearch(e.target.value);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		fetch(`api/search/${search}`)
			.then((res) => res.json())
			.then((res) => setAlbums(res))
			.catch((err) => console.error(err));
	};

	return (
		<div>
			<Card>
				<form className="grid gap-y-3" onSubmit={handleSubmit}>
					<input
						id="albumSearch"
						type="text"
						value={search}
						onChange={handleChange}
						placeholder="Album/Track"
						className="text-black border-1 border-cyan-800 py-1 px-6 rounded-xl text-xl"
					/>
					<div className="flex gap-4 flex-row">
						<button
							id="search"
							type="submit"
							className="btn-default min-w-1/2 grow"
						>
							Search
						</button>
						<button
							id="clear"
							type="button"
							onClick={() => setSearch("")}
							className="btn-default min-w-1/2 grow"
						>
							Clear
						</button>
					</div>
				</form>
			</Card>
			{albums && (
				<div className="grid gap-4 grid-cols-3">
					{albums.map((album: any) => {
						return (
							<div
								className="card flex grow justify-start max-w-4xl content-end space-x-4"
								key={album.vtName}
							>
								<img src={album.thumbnail} width="128" height="128" />
								<div className="md:container">
									<div className="place-self-start">
										<h1>{album.title}</h1>
										<h3>{album.year}</h3>
										<h6>{album.platforms.join(", ")}</h6>
									</div>
									<div className="pt-5">
										<Link href={`/album/${album.vtName}`}>
											<a className="btn-default">Browse</a>
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

// import React from 'react';
// import Head from 'next/head';
// import Link from 'next/link';

// function Home() {
//   return (
//     <React.Fragment>
//       <Head>
//         <title>Home - Nextron (with-typescript-tailwindcss)</title>
//       </Head>
//       <div className='grid grid-col-1 text-2xl w-full text-center'>
//         <img className='ml-auto mr-auto' src='/images/logo.png' />
//         <span>⚡ Electron ⚡</span>
//         <span>+</span>
//         <span>Next.js</span>
//         <span>+</span>
//         <span>tailwindcss</span>
//         <span>=</span>
//         <span>💕 </span>
//       </div>
//       <div className='mt-1 w-full flex-wrap flex justify-center'>
//         <Link href='/next'>
//           <a className='btn-blue'>Go to next page</a>
//         </Link>
//       </div>
//     </React.Fragment>
//   );
// }

// export default Home;
