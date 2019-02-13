import { Package } from "#SRC/js/data/cosmos/Package";

const mockRequest = jest.fn();
jest.mock("@dcos/http-service", () => ({
  request: mockRequest
}));
import { marbles } from "rxjs-marbles/jest";
import { take } from "rxjs/operators";

import * as utils from "../index";
import { UIMetadata } from "#SRC/js/data/ui-update/UIMetadata";

describe("utls", () => {
  describe("#queryCosmosForUIVersions", () => {
    it(
      "returns result from cosmos",
      marbles(m => {
        const reqResp$ = m.cold("--j|", {
          j: {
            response: { results: { "2.0.0": "1" } },
            code: 200,
            message: "OK"
          }
        });
        mockRequest.mockReturnValueOnce(reqResp$);

        const query$ = utils.queryCosmosForUIVersions();
        const result$ = query$.pipe(take(1));
        m.expect(result$).toBeObservable(
          m.cold("--(j|)", {
            j: {
              data: {
                package: {
                  name: "dcos-ui",
                  versions: [
                    {
                      version: "2.0.0",
                      revision: "1"
                    }
                  ]
                }
              }
            }
          })
        );
      })
    );
  });
  describe("#queryUIServiceForMetadata", () => {
    it(
      "returns result from ui-update-service",
      marbles(m => {
        const reqResp$ = m.cold("--j|", {
          j: {
            response: {
              default: false,
              packageVersion: "2.50.1",
              buildVersion: "master+v2.50.1+hfges"
            },
            code: 200,
            message: "OK"
          }
        });
        mockRequest.mockReturnValueOnce(reqResp$);
        window.DCOS_UI_VERSION = "unit_test+v2.50.1";

        const query$ = utils.queryUIServiceForMetadata();
        const result$ = query$.pipe(take(1));
        m.expect(result$).toBeObservable(
          m.cold("--(j|)", {
            j: {
              data: {
                ui: {
                  clientBuild: "unit_test+v2.50.1",
                  packageVersion: "2.50.1",
                  packageVersionIsDefault: false,
                  serverBuild: "master+v2.50.1+hfges"
                }
              }
            }
          })
        );
      })
    );
  });
  describe("#versionUpdateAvailable", () => {
    it("return latest version", () => {
      const fakePackageInfo: Package = {
        name: "dcos-ui",
        versions: [
          {
            version: "1.0.0",
            revision: "0"
          },
          {
            version: "1.5.0",
            revision: "0"
          },
          {
            version: "2.0.0",
            revision: "0"
          },
          {
            version: "2.1.0",
            revision: "0"
          }
        ]
      };
      const fakeUiMetadata: UIMetadata = {
        packageVersionIsDefault: true,
        packageVersion: "Default",
        serverBuild: "master+v1.0.0"
      };
      const result = utils.versionUpdateAvailable(
        fakePackageInfo,
        fakeUiMetadata
      );
      expect(result).not.toBeNull();
      expect(result.version).toEqual("1.5.0");
    });
    it("use packageVersion for comparison if available", () => {
      const fakePackageInfo: Package = {
        name: "dcos-ui",
        versions: [
          {
            version: "1.0.0",
            revision: "0"
          },
          {
            version: "1.5.0",
            revision: "0"
          },
          {
            version: "2.0.0",
            revision: "0"
          },
          {
            version: "2.1.0",
            revision: "0"
          }
        ]
      };
      const fakeUiMetadata: UIMetadata = {
        packageVersionIsDefault: false,
        packageVersion: "1.1.0",
        serverBuild: "master+v0.0.0"
      };
      const result = utils.versionUpdateAvailable(
        fakePackageInfo,
        fakeUiMetadata
      );
      expect(result).not.toBeNull();
      expect(result.version).toEqual("1.5.0");
    });
    it("returns null if there is no newer package", () => {
      const fakePackageInfo: Package = {
        name: "dcos-ui",
        versions: [
          {
            version: "1.0.0",
            revision: "0"
          }
        ]
      };
      const fakeUiMetadata: UIMetadata = {
        packageVersionIsDefault: false,
        packageVersion: "1.1.0",
        serverBuild: "master+v0.0.0"
      };
      const result = utils.versionUpdateAvailable(
        fakePackageInfo,
        fakeUiMetadata
      );
      expect(result).toBeNull();
    });
    it("returns null if newer package is different major version", () => {
      const fakePackageInfo: Package = {
        name: "dcos-ui",
        versions: [
          {
            version: "3.0.0",
            revision: "0"
          }
        ]
      };
      const fakeUiMetadata: UIMetadata = {
        packageVersionIsDefault: false,
        packageVersion: "1.1.0",
        serverBuild: "master+v0.0.0"
      };
      const result = utils.versionUpdateAvailable(
        fakePackageInfo,
        fakeUiMetadata
      );
      expect(result).toBeNull();
    });
  });
  describe("#rollbackDCOSUIVersion", () => true);
  describe("#updateDCOSUIVersion", () => true);
});
