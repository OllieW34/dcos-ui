import Tree from "#SRC/js/structs/Tree";

export default class ServiceTree extends Tree {
  getDeployments(): any;
  getQueue(): null;
  getRegions(): Array<any>;
  getHealth(): any;
  getId(): string;
  getServiceFromTaskID(taskID: Number): any;
  getTaskFromTaskID(taskID: any): any;
  getItemParent(id: any, parent: any): any;
  findItemById(id: any): any;
  filterItemsByFilter(filter: string): any;
  getInstancesCount(): Number;
  getName(): string;
  getResources(): object;
  getStatus(): string;
  getServiceStatus(): any;
  getServices(): any;
  getTasksSummary(): any;
  getRunningInstancesCount(): Number;
  getFrameworks(): any;
  getVolumes(): any;
  getLabels(): any;
}
