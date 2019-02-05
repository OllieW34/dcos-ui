import * as React from "react";
import { NumberCell } from "@dcos/ui-kit";
import sort from "array-sort";

import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";
import Units from "#SRC/js/utils/Units";
import { SortDirection } from "plugins/services/src/js/types/SortDirection";

export function diskRenderer(
  service: Service | Pod | ServiceTree
): React.ReactNode {
  const resource = service.getResources()[`disk`];

  return (
    <NumberCell>
      <span>{Units.formatResource("disk", resource)}</span>
    </NumberCell>
  );
}

function compareServicesByDiskUsage(
  a: Service | Pod | ServiceTree,
  b: Service | Pod | ServiceTree
): number {
  return a.getResources()[`disk`] - b.getResources()[`disk`];
}

const comparators = [compareServicesByDiskUsage];
export function diskSorter(data: any, sortDirection: SortDirection): any {
  const reverse = sortDirection !== "ASC";
  return sort(data, comparators, { reverse });
}
