export default class ServiceTableUtil {
  static getFormattedVersion(service: any): any;
  numberCompareFunction(a: Number, b: Number): Number;
  validateSemver(version: string): Boolean;
  dottedNumberCompareFunction(a: string, b: string): any;
  nameCompareFunction(a: string, b: string): any;
  taskCompareFunction(a: any, b: any): any;
  statusCompareFunction(a: any, b: any): any;
  cpusCompareFunction(a: any, b: any): any;
  gpusCompareFunction(a: any, b: any): any;
  memCompareFunction(a: any, b: any): any;
  diskCompareFunction(a: any, b: any): any;
  instancesCompareFunction(a: any, b: any): any;
  versionCompareFunction(a: any, b: any): any;
  getCompareFunctionByProp(prop: any): any;
  propCompareFunctionFactory(prop: any, direction: any): any;
}
