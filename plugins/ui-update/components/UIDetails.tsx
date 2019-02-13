import * as React from "react";
import { componentFromStream } from "@dcos/data-service";
import { catchError, filter, map, startWith, switchMap } from "rxjs/operators";
import { BehaviorSubject, combineLatest, merge, of } from "rxjs";

import Loader from "#SRC/js/components/Loader";
import {
  FALLBACK_UI_METADATA,
  queryCosmosForUIVersions,
  queryUIServiceForMetadata,
  rollbackDCOSUIVersion,
  updateDCOSUIVersion,
  versionUpdateAvailable
} from "#PLUGINS/ui-update/utils";

import ConfigurationMapSection from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";

import InstalledVersion from "./InstalledVersion";
import AvailableUpdateRow from "./AvailableUpdateRow";

import {
  EMPTY_ACTION,
  UIAction,
  UIActions
} from "#PLUGINS/ui-update/types/UIAction";
import { UIMetadata } from "#SRC/js/data/ui-update/UIMetadata";
import { Package } from "#SRC/js/data/cosmos/Package";

const Loading = () => <Loader size="small" type="ballBeat" />;
const InitialScreen = () => {
  return (
    <ConfigurationMapSection>
      <ConfigurationMapValue>
        <Loading />
      </ConfigurationMapValue>
    </ConfigurationMapSection>
  );
};
const FallbackScreen = () => {
  // If the stream errors fallback to displaying just the local build version
  // based on window.DCOS_UI_VERSION
  return (
    <ConfigurationMapSection>
      <InstalledVersion uiMetaData={FALLBACK_UI_METADATA} />
    </ConfigurationMapSection>
  );
};

const uiServiceActions$ = new BehaviorSubject<UIAction>(EMPTY_ACTION);

function onClickRollbackUI() {
  rollbackDCOSUIVersion(uiServiceActions$);
}

function onClickStartUpdate(version: string) {
  updateDCOSUIVersion(version, uiServiceActions$);
}

const UIDetails = componentFromStream(() => {
  const cosmosVersions$ = queryCosmosForUIVersions().pipe(
    map(result => result.data.package)
  );
  const uiMetadata$ = queryUIServiceForMetadata().pipe(
    map(result => result.data.ui)
  );
  const uiMetadataOnAction$ = uiServiceActions$.pipe(
    filter(
      uiAction =>
        uiAction.action === UIActions.Completed ||
        uiAction.action === UIActions.Error
    ),
    switchMap(() =>
      queryUIServiceForMetadata().pipe(map(result => result.data.ui))
    )
  );

  return combineLatest<[Package, UIMetadata, UIAction]>([
    cosmosVersions$,
    merge(uiMetadata$, uiMetadataOnAction$),
    uiServiceActions$
  ]).pipe(
    map(([packageInfo, uiMetadata, uiAction]) => {
      if (!packageInfo || !uiMetadata) {
        return <InitialScreen />;
      }
      const latestUpdateAvailable = versionUpdateAvailable(
        packageInfo,
        uiMetadata
      );

      return (
        <ConfigurationMapSection>
          <InstalledVersion
            uiMetaData={uiMetadata}
            uiAction={uiAction}
            onRollbackClick={onClickRollbackUI}
          />
          <AvailableUpdateRow
            latestVersion={latestUpdateAvailable}
            uiAction={uiAction}
            onUpdateClick={onClickStartUpdate}
          />
        </ConfigurationMapSection>
      );
    }),
    catchError(() => of(<FallbackScreen />)),
    startWith(<InitialScreen />)
  );
});

export default UIDetails;
