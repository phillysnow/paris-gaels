import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-pg-warm px-4 text-center">
			<h1 className="font-display text-3xl font-bold text-pg-ink">Page introuvable</h1>
			<p className="mt-4 text-pg-muted">Cette page n’existe pas ou a été déplacée.</p>
			<p className="mt-8">
				<Link
					href="/fr"
					className="rounded-md bg-pg-red px-5 py-2.5 font-display text-sm font-bold text-white shadow-md shadow-pg-red/25 transition hover:bg-red-600"
				>
					Retour à l’accueil
				</Link>
			</p>
		</div>
	);
}
