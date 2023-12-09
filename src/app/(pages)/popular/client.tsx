"use client";

import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import { TopAiring } from "@/types";
import { useState, useTransition } from "react";
import { getMore } from "./actions";

interface InfiniteListProps {
  initialData: TopAiring;
}

export function InfiniteList({ initialData }: InfiniteListProps) {
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const [page, setPage] = useState(initialData.currentPage);
  const [list, setList] = useState(initialData.results);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center lg:items-start lg:justify-start gap-2">
        {list.map((drama) => (
          <Card
            key={drama.id}
            data={{
              title: drama.title,
              image: drama.image,
              description: ``,
              slug: drama.id.replace("drama-detail/", ""),
            }}
            className="lg:w-[250px] w-28"
            aspectRatio="square"
            width={250}
            height={330}
          />
        ))}
      </div>
      <Button
        className="w-full mt-4"
        variant={"secondary"}
        onClick={() =>
          startTransition(async () => {
            if (hasNextPage) {
              const moreData = await getMore(page + 1);
              if (moreData?.results) {
                setList([...list, ...moreData.results]);
              }
              setPage(moreData?.currentPage ?? page);
              setHasNextPage(moreData?.hasNextPage ?? hasNextPage);
            }
          })
        }
        disabled={isPending}
      >
        Load more
      </Button>
    </div>
  );
}
