import * as React from "react";
import { TextCell } from "@dcos/ui-kit";
import { Tooltip } from "reactjs-components";
import sort from "array-sort";

import CompositeState from "#SRC/js/structs/CompositeState";
import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";
import { SortDirection } from "plugins/services/src/js/types/SortDirection";

export function regionRenderer(
  service: Service | Pod | ServiceTree
): React.ReactNode {
  const localRegion: string = CompositeState.getMasterNode().getRegionName();
  let regions: string[] = service.getRegions();

  regions = regions.map(
    region => (region === localRegion ? region + " (Local)" : region)
  );

  if (regions.length === 0) {
    regions.push("N/A");
  }

  return (
    <TextCell>
      <Tooltip elementTag="span" wrapText={true} content={regions.join(", ")}>
        {regions.join(", ")}
      </Tooltip>
    </TextCell>
  );
}

function compareNodesByRegion(
  a: Service | Pod | ServiceTree,
  b: Service | Pod | ServiceTree
): number {
  let regionA: string = a.getRegions[0] || "N/A";
  let regionB: string = b.getRegions[0] || "N/A";

  return regionA.toLowerCase().localeCompare(regionB.toLowerCase());
}

const comparators = [compareNodesByRegion];
export function regionSorter(data: any, sortDirection: SortDirection): any {
  const reverse = sortDirection !== "ASC";
  return sort(data, comparators, { reverse });
}
