import { AccountConfirmationModal } from "@/components/account-confirmation-modal";
import { Card } from "@/components/card";
import { DashboardHeader } from "@/components/header";
import { Input } from "@/components/input";
import { useGlobalTools } from "@/contexts/global-tools-conext";
import { noteApi } from "@/services/axios/note-api";
import { NoteProps } from "@/types/note-props";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = nookies.get(ctx)["purplenotes.token"];

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

export default function Dashboard() {
  const [notes, setNotes] = useState<NoteProps[]>([]);
  const [filtered, setFiltered] = useState<NoteProps[]>([]);
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const { successNotification } = useGlobalTools();

  const searchTimeout = useRef<NodeJS.Timeout>();

  const filter = (key: string) => {
    setFiltered(() =>
      notes.filter((item) =>
        item.title.toLowerCase().includes(key.toLowerCase())
      )
    );
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      filter(e.target.value);
    }, 500);
  };

  const getAllMyNotes = useCallback(async () => {
    setIsFetching(true);
    const res = await noteApi.getAllMyNotes();

    switch (res.status) {
      case 200:
        setNotes(res.data);
        break;
    }
    setIsFetching(false);
  }, []);

  const navigate = useRouter();

  const createNote = async () => {
    const res = await noteApi.createNote();

    switch (res.status) {
      case 201:
        navigate.push(`/${res.data._id}/edit`);
        successNotification("Note created successfully");
        break;

      case 401:
        break;
    }
  };

  useEffect(() => {
    getAllMyNotes();
  }, []);

  return (
    <>
      <Head>
        <title>Home - Purple Notes</title>
      </Head>
      <AccountConfirmationModal />
      <DashboardHeader />
      <header className="safe-area min-h-[280px] py-8 flex flex-col items-center border-b-2 border-b-neutral-800">
        {isFetching ? (
          <div className="animate-pulse w-[350px] rounded-lg bg-neutral-800 h-8 my-auto" />
        ) : (
          <Input
            value={search}
            onChange={onChangeSearch}
            className="min-w-[350px] my-auto"
            placeholder="Search my note"
          />
        )}

        <div className="mt-auto w-full flex justify-between">
          {isFetching ? (
            <div className="animate-pulse rounded-full bg-neutral-800 w-24 h-5" />
          ) : (
            <span className="text-primary">
              {!!search
                ? `${filtered.length} ${
                    filtered.length > 1 ? "notes" : "note"
                  } found`
                : `You have ${notes.length} notes`}
            </span>
          )}
        </div>
      </header>
      <main className="safe-area my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {!isFetching && (
          <button
            className="h-64 rounded-md bg-neutral-800 flex justify-center items-center duration-300 hover:opacity-80"
            onClick={createNote}
          >
            <BsPlusLg className="text-neutral-600 text-7xl" />
          </button>
        )}
        {isFetching ? (
          <SkeletonList />
        ) : filtered.length > 0 ? (
          filtered.map((note) => <Card {...note} key={note._id} />)
        ) : (
          notes.map((note) => <Card {...note} key={note._id} />)
        )}
      </main>
    </>
  );
}

function SkeletonList() {
  return (
    <div className="animate-pulse col-span-4 safe-area grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
      <div className="p-2 h-64 bg-neutral-800 rounded-md" />
    </div>
  );
}
