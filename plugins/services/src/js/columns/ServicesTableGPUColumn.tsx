import * as React from "react";
import { NumberCell } from "@dcos/ui-kit";
import sort from "array-sort";

import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";
import Units from "#SRC/js/utils/Units";
import { SortDirection } from "plugins/services/src/js/types/SortDirection";

export function gpuRenderer(
  service: Service | Pod | ServiceTree
): React.ReactNode {
  const resource = service.getResources()[`gpus`];

  return (
    <NumberCell>
      <span>{Units.formatResource("gpus", resource)}</span>
    </NumberCell>
  );
}

function compareServicesByGpuUsage(
  a: Service | Pod | ServiceTree,
  b: Service | Pod | ServiceTree
): number {
  return a.getResources()[`gpus`] - b.getResources()[`gpus`];
}

const comparators = [compareServicesByGpuUsage];
export function gpuSorter(data: any, sortDirection: SortDirection): any {
  const reverse = sortDirection !== "ASC";
  return sort(data, comparators, { reverse });
}
