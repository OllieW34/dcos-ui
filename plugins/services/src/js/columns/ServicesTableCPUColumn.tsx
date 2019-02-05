import * as React from "react";
import { NumberCell } from "@dcos/ui-kit";
import sort from "array-sort";

import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";
import Units from "#SRC/js/utils/Units";
import { SortDirection } from "plugins/services/src/js/types/SortDirection";

export function cpuRenderer(
  service: Service | Pod | ServiceTree
): React.ReactNode {
  const resource = service.getResources()[`cpus`];

  return (
    <NumberCell>
      <span>{Units.formatResource("cpus", resource)}</span>
    </NumberCell>
  );
}

function compareServicesByCpuUsage(
  a: Service | Pod | ServiceTree,
  b: Service | Pod | ServiceTree
): number {
  return a.getResources()[`cpus`] - b.getResources()[`cpus`];
}

const comparators = [compareServicesByCpuUsage];
export function cpuSorter(data: any, sortDirection: SortDirection): any {
  const reverse = sortDirection !== "ASC";
  return sort(data, comparators, { reverse });
}
