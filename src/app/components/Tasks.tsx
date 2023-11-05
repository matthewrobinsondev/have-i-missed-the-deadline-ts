"use client";

import { trpc } from "../trpc/client";

export default function Tasks() {
    const tasks = trpc.getTasks.useQuery();

    return (
        <div>
            <div>{JSON.stringify(tasks.data)}</div>
        </div>
    )
}