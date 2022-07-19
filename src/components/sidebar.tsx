import {
  ChartSquareBarIcon,
  ClockIcon,
  FolderIcon,
} from "@heroicons/react/outline";

import Link from "next/link";
import { classNames } from "../utils/aux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Time Keeper", icon: ClockIcon, href: "/app/timekeeper" },
  {
    name: "Dashboard",
    icon: ChartSquareBarIcon,
    href: "/app/dashboard",
  },
  {
    name: "Backlog",
    icon: FolderIcon,
    href: "/app/backlog",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="flex-1 flex flex-col w-56 min-h-0 bg-gray-800">
      <div className="flex-1 flex flex-col w-56 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-8 w-auto "
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
            alt="Workflow"
          />
        </div>
        <nav
          className="mt-5 flex-1 px-2 bg-gray-800 space-y-1"
          aria-label="Sidebar"
        >
          {navigation.map((item) => (
            <div
              key={item.name}
              className={classNames(
                router.pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "group flex items-center min-w-fit px-2 py-2 text-sm font-medium rounded-md"
              )}
            >
              <item.icon
                className={classNames(
                  router.pathname === item.href
                    ? "text-gray-300"
                    : "text-gray-400 group-hover:text-gray-300",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />
              <Link href={item.href}>
                <a className="w-full">{item.name}</a>
              </Link>
              {item.count ? (
                <span
                  className={classNames(
                    router.pathname === item.href
                      ? "bg-gray-800"
                      : "bg-gray-900 group-hover:bg-gray-800",
                    "ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full"
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
            <select
              id="location"
              name="location"
              className="block w-full py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue="Canada"
              onChange={(e) => {
                console.log(e.target.value);
              }}
            >
              <option>Project 1</option>
              <option>Project 2</option>
              <option>Project 3</option>
            </select>
          </div>
          <div className="p-2" />
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={session?.user?.image}
                alt="profile_pic"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {session?.user?.name}
              </p>
              <Link href="/app/profile">
                <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200 cursor-pointer">
                  View profile
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
