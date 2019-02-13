import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, delay, take } from "rxjs/operators";
import { graphqlObservable } from "@dcos/data-service";
import gql from "graphql-tag";
import semver, { SemVer } from "semver";

import { schema as cosmosSchema } from "#SRC/js/data/cosmos";
import { Package } from "#SRC/js/data/cosmos/Package";
import { default as uiServiceSchema } from "#SRC/js/data/ui-update";
import { UIMetadata } from "#SRC/js/data/ui-update/UIMetadata";
import { UIAction, UIActions } from "#PLUGINS/ui-update/types/UIAction";
import { FormattedPackageVersion } from "#PLUGINS/ui-update/types/FormattedPackageVersion";

interface MutationError {
  message: string;
  name: string;
}
interface UIUpdateResult {
  data: { updateDCOSUI: string };
}
interface UIRollbackResult {
  data: { resetDCOSUI: string };
}
export const FALLBACK_UI_METADATA: UIMetadata = {
  clientBuild: window.DCOS_UI_VERSION
};

export function queryCosmosForUIVersions(): Observable<{
  data: { package: Package };
}> {
  return graphqlObservable(
    gql`
      query {
        package(name: $packageName) {
          name
          versions
        }
      }
    `,
    cosmosSchema,
    { packageName: "dcos-ui" }
  );
}

export function queryUIServiceForMetadata(): Observable<{
  data: { ui: UIMetadata };
}> {
  return graphqlObservable(
    gql`
      query {
        ui {
          clientBuild
          packageVersion
          packageVersionIsDefault
          serverBuild
        }
      }
    `,
    uiServiceSchema,
    { packageName: "dcos-ui" }
  ).pipe(catchError(() => of({ data: { ui: FALLBACK_UI_METADATA } })));
}

function parseCurrentVersion(uiMetadata: UIMetadata): SemVer | null {
  const coercedPackageVersion = semver.coerce(uiMetadata.packageVersion);
  if (coercedPackageVersion !== null) {
    return coercedPackageVersion;
  }
  const coercedServerBuild = semver.coerce(uiMetadata.serverBuild);
  if (coercedServerBuild !== null) {
    return coercedServerBuild;
  }
  return null;
}

export function versionUpdateAvailable(
  packageInfo: Package,
  uiMetadata: UIMetadata
): FormattedPackageVersion | null {
  // Parse current version from metadata
  const currentVersion = parseCurrentVersion(uiMetadata);
  if (currentVersion === null) {
    return null;
  }
  // Compare to package versions to find the greatest available version
  const availableVersions = packageInfo.versions
    .map(val => ({ display: semver.coerce(val.version), ...val }))
    .filter((val: FormattedPackageVersion) => val.display !== null)
    .filter(
      (val: FormattedPackageVersion) =>
        val.display.major === currentVersion.major
    )
    .sort((a: FormattedPackageVersion, b: FormattedPackageVersion) =>
      semver.rcompare(a.display, b.display)
    );
  if (availableVersions.length === 0) {
    return null;
  }
  // if greatest version !== installed version, return it, otherwise return null
  if (semver.gt(availableVersions[0].display, currentVersion)) {
    return availableVersions[0];
  }
  return null;
}

export function rollbackDCOSUIVersion(action$: BehaviorSubject<UIAction>) {
  const actionType = "UIReset";
  action$.next({
    type: actionType,
    action: UIActions.Started,
    value: ""
  });
  let receivedResult = false;

  graphqlObservable(
    gql`
      mutation {
        resetDCOSUI
      }
    `,
    uiServiceSchema,
    {}
  )
    .pipe(
      take(1),
      delay(45000)
    )
    .subscribe(
      (result: UIRollbackResult | undefined) => {
        if (result) {
          action$.next({
            type: actionType,
            action: UIActions.Completed,
            value: result.data.resetDCOSUI
          });
          receivedResult = true;
        }
      },
      (error: MutationError) => {
        action$.next({
          type: actionType,
          action: UIActions.Error,
          value: error.message
        });
        receivedResult = true;
      },
      () => {
        if (!receivedResult) {
          action$.next({
            type: actionType,
            action: UIActions.Completed,
            value: ""
          });
        }
      }
    );
}

export function updateDCOSUIVersion(
  version: string,
  action$: BehaviorSubject<UIAction>
) {
  const actionType = "UIUpdate";
  action$.next({
    type: actionType,
    action: UIActions.Started,
    value: version
  });
  let receivedResult = false;

  graphqlObservable(
    gql`
      mutation {
        updateDCOSUI(newVersion: $version)
      }
    `,
    uiServiceSchema,
    {
      version
    }
  )
    .pipe(
      take(1),
      delay(45000)
    )
    .subscribe(
      (result: UIUpdateResult | undefined) => {
        if (result) {
          action$.next({
            type: actionType,
            action: UIActions.Completed,
            value: result.data.updateDCOSUI
          });
          receivedResult = true;
        }
      },
      (error: MutationError) => {
        action$.next({
          type: actionType,
          action: UIActions.Error,
          value: error.message
        });
        receivedResult = true;
      },
      () => {
        if (!receivedResult) {
          action$.next({
            type: actionType,
            action: UIActions.Completed,
            value: ""
          });
        }
      }
    );
}
