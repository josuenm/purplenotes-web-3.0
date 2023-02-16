import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";

interface SettingsModalProps extends HTMLAttributes<HTMLElement> {}

interface SettingLinkProps {
  id: string;
  title: string;
  url: string;
}

export function SettingsModal({ children, ...rest }: SettingsModalProps) {
  const settingLinks: SettingLinkProps[] = [
    {
      id: "0",
      title: "Profile",
      url: "profile",
    },
  ];

  const { pathname } = useRouter();

  const isActive = (url: string) => {
    const paths = pathname.split("/");
    pathname.split("/")[0] = "/";

    return paths.some((key) => key === url);
  };

  const getTitle = () => {
    const paths = pathname.split("/");
    pathname.split("/")[0] = "/";

    const link: SettingLinkProps | undefined = settingLinks.find((link) =>
      paths.some((key) => key === link.url)
    );

    if (!link) return;
    return link.title;
  };

  return (
    <div className="safe-area">
      <div className="bg-neutral-800 rounded-md px-4 py-12 grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-0">
        <aside className="border-b border-b-neutral-700 md:border-b-0 md:border-r md:border-r-neutral-700 pb-3 md:pb-0 md:pr-3 md:col-span-2">
          <ul className="flex flex-col gap-4">
            {settingLinks.map((link) => (
              <Link href={`/dashboard/settings/${link.url}`} key={link.id}>
                <li
                  className={`rounded-full px-5 py-2 font-medium ${
                    isActive(link.url)
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-neutral-900/50"
                  }`}
                >
                  {link.title}
                </li>
              </Link>
            ))}
          </ul>
        </aside>
        <div className="md:col-span-4 md:pl-8">
          <main {...rest}>{children}</main>
        </div>
      </div>
    </div>
  );
}
