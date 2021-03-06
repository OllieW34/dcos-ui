import compareVersions from "compare-versions";

import StatusSorting from "../constants/StatusSorting";
import Framework from "../structs/Framework";
import ServiceTree from "../structs/ServiceTree";
import FrameworkUtil from "./FrameworkUtil";

/**
 * Get raw and display formatted service versions
 * @param {Service} service
 * @returns {object} object containing rawVersion and displayVersion
 */
function getFormattedVersion(service) {
  if (!service.getVersion || service.getVersion === "") {
    return null;
  }
  const rawVersion = service.getVersion();
  const displayVersion =
    service && service instanceof Framework
      ? FrameworkUtil.extractBaseTechVersion(rawVersion)
      : "";

  return { rawVersion, displayVersion };
}

/**
 * Compare number values
 * @param {number} a
 * @param {number} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function numberCompareFunction(a, b) {
  const delta = a - b;

  return delta / Math.abs(delta || 1);
}

/**
 * Validate whether a version string is semver formatteed
 * @param {string} version
 * @returns {boolean} true if "version" is semver formatted,
 * false otherwise.
 */
function validateSemver(version) {
  const semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)?)?$/i;

  return semver.test(version);
}

/**
 * Compare dotted number strings
 * @param {string} a
 * @param {string} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function dottedNumberCompareFunction(a, b) {
  if (!a && !b) {
    return 0;
  } else if (!a) {
    return -1;
  } else if (!b) {
    return 1;
  } else if (!validateSemver(a) && !validateSemver(b)) {
    return a.localeCompare(b);
  } else if (!validateSemver(a)) {
    return -1;
  } else if (!validateSemver(b)) {
    return 1;
  } else {
    return compareVersions(a, b);
  }
}

/**
 * Compare service names
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function nameCompareFunction(a, b) {
  return a.getName().localeCompare(b.getName());
}

/**
 * Compare number of running tasks
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function taskCompareFunction(a, b) {
  return numberCompareFunction(
    a.getTasksSummary().tasksRunning,
    b.getTasksSummary().tasksRunning
  );
}

/**
 * Compare service status
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function statusCompareFunction(a, b) {
  return numberCompareFunction(
    StatusSorting[a.getServiceStatus().displayName],
    StatusSorting[b.getServiceStatus().displayName]
  );
}

/**
 * Compare service cpus
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function cpusCompareFunction(a, b) {
  return numberCompareFunction(a.getResources().cpus, b.getResources().cpus);
}

/**
 * Compare service gpus
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function gpusCompareFunction(a, b) {
  return numberCompareFunction(a.getResources().gpus, b.getResources().gpus);
}

/**
 * Compare service memory
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function memCompareFunction(a, b) {
  return numberCompareFunction(a.getResources().mem, b.getResources().mem);
}

/**
 * Compare service disk
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {number} a number indicating whether "a" comes before or after or
 * is the same as "b" in sort order.
 */
function diskCompareFunction(a, b) {
  return numberCompareFunction(a.getResources().disk, b.getResources().disk);
}

/**
 * Compare service instances
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {Number} desc first
 */
function instancesCompareFunction(a, b) {
  return numberCompareFunction(a.instances, b.instances);
}

/**
 * Compare service version
 * @param {Service|ServiceTree} a
 * @param {Service|ServiceTree} b
 * @returns {Number} desc first
 */
function versionCompareFunction(a, b) {
  const aVersion = getFormattedVersion(a);
  const bVersion = getFormattedVersion(b);

  return dottedNumberCompareFunction(
    aVersion && aVersion.displayVersion,
    bVersion && bVersion.displayVersion
  );
}

/**
 * Get service table prop compare functions
 * @param {string} prop
 * @returns {function} prop compare function
 */
function getCompareFunctionByProp(prop) {
  switch (prop) {
    case "name":
      return nameCompareFunction;
    case "tasks":
      return taskCompareFunction;
    case "status":
      return statusCompareFunction;
    case "cpus":
      return cpusCompareFunction;
    case "gpus":
      return gpusCompareFunction;
    case "mem":
      return memCompareFunction;
    case "disk":
      return diskCompareFunction;
    case "instances":
      return instancesCompareFunction;
    case "version":
      return versionCompareFunction;
    default:
      return function() {
        return 0;
      };
  }
}

const ServiceTableUtil = {
  /**
   * Create service table prop compare functions
   * @param {string} prop
   * @param {string} [direction]
   * @returns {function} prop compare function
   */
  propCompareFunctionFactory(prop, direction) {
    const compareFunction = getCompareFunctionByProp(prop);
    let score = 1;

    if (direction === "desc") {
      score = -1;
    }

    return function(a, b) {
      // Hoist service trees to the top
      if (a instanceof ServiceTree && !(b instanceof ServiceTree)) {
        return score * -1;
      } else if (b instanceof ServiceTree && !(a instanceof ServiceTree)) {
        return score;
      }

      return compareFunction(a, b);
    };
  },

  getFormattedVersion
};

module.exports = ServiceTableUtil;
