import { NoteProps } from "@/types/note-props";
import { formatHtml } from "@/utils/helpers";
import { format, isAfter, parseISO } from "date-fns";
import Link from "next/link";
import { BiLock } from "react-icons/bi";

export function Card({
  _id,
  title,
  body,
  privacy,
  createdAt,
  updatedAt,
}: NoteProps) {
  return (
    <Link
      href={`/${_id}`}
      className="p-2 h-64 bg-neutral-800 duration-300 md:hover:opacity-80 rounded-md cursor-pointer flex flex-col gap-2"
    >
      <header className="bg-neutral-700 px-2 py-1 rounded-md">
        {title.length > 33 ? title.slice(0, 33) + "..." : title}
      </header>
      <p className="p-2">{formatHtml(body, 45)}</p>

      <footer className="mt-auto p-2 text-sm flex flex-col gap-2">
        <p className="px-2 py-1 text-primary bg-primary/20 w-fit rounded-md flex items-center gap-2">
          {privacy ? "Private" : "Free to read"}
          {privacy ? <BiLock /> : null}
        </p>
        <p className="px-2 py-1 text-primary bg-primary/20 w-fit rounded-md flex items-center gap-2">
          Created at {format(parseISO(createdAt), "dd/MM/yyyy - HH:MM")}
        </p>
        {!isAfter(parseISO(updatedAt), parseISO(createdAt)) ? null : (
          <p className="px-2 py-1 text-primary bg-primary/20 w-fit rounded-md flex items-center gap-2">
            Updated at {format(parseISO(updatedAt), "dd/MM/yyyy - HH:MM")}
          </p>
        )}
      </footer>
    </Link>
  );
}
