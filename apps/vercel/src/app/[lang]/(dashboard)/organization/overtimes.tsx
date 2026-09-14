"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "cn";
import { format } from "date-fns";
import type { schema } from "db/postgres";
import { Loader, RefreshCcw, Square, SquareCheckBig } from "lucide-react";
import React from "react";

type Row = typeof schema.overtimes.$inferSelect;

const columnHelper = createColumnHelper<Row>();
const columns = [
  columnHelper.accessor("id", {}),
  columnHelper.accessor("date", {
    cell: ({ getValue }) => {
      return format(getValue(), "yyyy-MM-dd");
    },
  }),
  columnHelper.accessor("duration", {}),
  columnHelper.accessor("note", {}),
  columnHelper.accessor("cashed", {
    cell: ({ getValue }) => {
      return getValue() ? <SquareCheckBig /> : <Square />;
    },
  }),
];

interface QueryResult {
  count: number;
  rows: Row[];
}

interface OvertimesProps {
  action: () => Promise<QueryResult>;
}

export const Overtimes = (props: OvertimesProps) => {
  "use no memo";

  const query = useQuery({
    queryKey: ["overtimes"],
    queryFn: async () => {
      const data = await props.action();

      return data;
    },
  });

  const data = React.useMemo(() => query.data?.rows || [], [query.data]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data,
    getRowId: (row) => row.id.toString(),
  });

  const renderBody = () => {
    if (query.isPending) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            <div className="flex items-center justify-center p-3">
              <Loader className="animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (query.isError) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            {query.error.message}
          </TableCell>
        </TableRow>
      );
    }

    if (table.getRowCount() === 0) {
      return (
        <TableRow>
          <TableCell colSpan={table.getAllLeafColumns().length}>
            No Data
          </TableCell>
        </TableRow>
      );
    }

    return table.getRowModel().rows.map((row) => {
      return (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell key={cell.id}>
                {cell.getIsPlaceholder() ||
                  flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtimes</CardTitle>
        <CardAction>
          <Button
            onClick={() => {
              query.refetch();
            }}
            disabled={query.isRefetching}
            variant={"ghost"}
            size={"icon"}
          >
            <RefreshCcw className={cn(query.isRefetching && "animate-spin")} />
          </Button>
        </CardAction>
      </CardHeader>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => {
            return (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => {
                  return (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ||
                        flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </Card>
  );
};
