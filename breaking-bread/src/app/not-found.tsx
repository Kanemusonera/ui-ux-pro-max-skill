import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="label text-bronze-deep">404</p>
      <h1 className="display mt-4 text-6xl md:text-7xl">That dish isn't on the menu.</h1>
      <p className="mt-5 max-w-md text-lg text-stone">The page you were looking for has moved or never existed.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/recipes" className="btn btn-dark">
          Browse recipes
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
