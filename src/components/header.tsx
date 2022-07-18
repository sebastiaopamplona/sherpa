import Link from "next/link";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Client", href: "/client" },
  { name: "Server", href: "/server" },
  { name: "Protected", href: "/protected" },
  { name: "API", href: "/api" },
  { name: "Admin", href: "/admin" },
  { name: "Me", href: "/me" },
];

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="bg-slate-200">
      <nav className="p-1">
        <div className="w-full  py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <ul className="flex list-none">
            {navigation.map((link) => (
              <li key={link.name} className="inline-block px-1">
                <Link href={link.href}>
                  <a>{link.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
