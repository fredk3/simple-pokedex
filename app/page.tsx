import * as React from "react";
import { SearchInput } from "./search-input";
import { sleep } from "./utils";

type Pokemon = {
	name: string;
	id: number;
};

export function generateMetadata(props: {
	searchParams?: Record<string, string | undefined>;
}) {
	const query = props.searchParams?.search;
	return {
		title: query ? `Searching for ${query}` : "Search page",
	};
}
export default function Page(props: {
	searchParams?: Record<string, string | undefined>;
}) {
	const keyString = `search=${props.searchParams?.search}&wait=${props.searchParams?.wait}`;
	return (
		<section className="flex flex-col">
			<SearchInput />

			{props.searchParams?.search ? (
				<React.Suspense
					key={keyString}
					fallback={
						<ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 py-4 pb-52 place-items-stretch">
							<PokemonCardSkeleton />
							<PokemonCardSkeleton />
							<PokemonCardSkeleton />
							<PokemonCardSkeleton />
						</ul>
					}
				>
					<PokemonList
						name={props.searchParams?.search}
						wait={props.searchParams?.wait === "on"}
					/>
				</React.Suspense>
			) : (
				<div className="col-span-full py-8 px-4 flex items-center gap-8 justify-center">
					<hr className="h-px w-20 text-gray-100/20" />
					<p className="text-center flex-none italic">Search for a pokemon</p>
					<hr className="h-px w-20 text-gray-100/20" />
				</div>
			)}
		</section>
	);
}

async function PokemonList(props: { name: string; wait: boolean }) {
	if (props.wait) {
		await sleep(2000);
	}
	const pokemons = await fetch(`https://graphql.pokeapi.co/v1beta2`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			query: /* GraphQL */ `
        query ($name: String!) {
          pokemons: pokemon(
            where: { name: { _ilike: $name } }
            limit: 20
          ) {
            name
            id
          }
        }
      `,
			variables: {
				name: `${props.name}%`,
			},
		}),
	})
		.then(
			(r) =>
				r.json() as Promise<{
					data: { pokemons: Array<Pokemon> };
				}>,
		)
		.then((result) => result.data?.pokemons ?? []);

	return (
		<div
			className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 py-4 pb-52 place-items-stretch`}
		>
			{pokemons.map((p) => (
				<li className="list-none" key={p.id}>
					<PokemonCard pokemon={p} />
				</li>
			))}
			{props.name.length > 0 && pokemons.length === 0 && (
				<li className="list-none text-center italic col-span-full py-8">
					No results found for `{props.name}`
				</li>
			)}
		</div>
	);
}

function PokemonCardSkeleton() {
	return (
		<div className="border rounded-md bg-gray-600 border-gray-200 font-normal p-2 flex flex-col gap-4">
			<span className="sr-only">Loading pokemon...</span>
			<div className="flex gap-2 bg-slate-400 h-4 rounded animate-pulse" />

			<div className="h-[200px] w-full bg-slate-400 rounded animate-pulse" />

			<div className="flex gap-2 bg-slate-400 h-4 rounded animate-pulse" />
		</div>
	);
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
	const pokemonPNGURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

	return (
		<dl className="border rounded-md bg-gray-600 border-gray-200 font-normal p-2 flex flex-col gap-4">
			<div className="flex gap-2 justify-center items-center">
				<dt>ID : </dt>
				<dd>
					<strong>{pokemon.id}</strong>
				</dd>
			</div>

			{/*  eslint-disable-next-line @next/next/no-img-element  */}
			<img
				width={200}
				height={200}
				src={pokemonPNGURL}
				alt={pokemon.name}
				className="h-[200px] w-[200px] self-center drop-shadow-md relative z-1"
			/>

			<div className="flex gap-2 justify-center items-center">
				<dt>Name: </dt>
				<dd>{pokemon.name}</dd>
			</div>
		</dl>
	);
}
