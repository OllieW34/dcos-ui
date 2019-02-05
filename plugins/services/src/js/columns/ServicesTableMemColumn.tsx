import * as React from "react";
import { NumberCell } from "@dcos/ui-kit";
import sort from "array-sort";

import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";
import Units from "#SRC/js/utils/Units";
import { SortDirection } from "plugins/services/src/js/types/SortDirection";

export function memRenderer(
  service: Service | Pod | ServiceTree
): React.ReactNode {
  const resource = service.getResources()[`mem`];
  return (
    <NumberCell>
      <span>{Units.formatResource("mem", resource)}</span>
    </NumberCell>
  );
}

function compareServicesByMemUsage(
  a: Service | Pod | ServiceTree,
  b: Service | Pod | ServiceTree
): number {
  return a.getResources()[`mem`] - b.getResources()[`mem`];
}

const comparators = [compareServicesByMemUsage];
export function memSorter(data: any, sortDirection: SortDirection): any {
  const reverse = sortDirection !== "ASC";
  return sort(data, comparators, { reverse });
}
