import * as React from "react";
import { Trans } from "@lingui/macro";
import semver from "semver";

import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import { UIMetadata } from "#SRC/js/data/ui-update/UIMetadata";
import { UIAction, UIActions } from "../types/UIAction";

interface InstalledVersionProps {
  uiMetaData: UIMetadata | null;
  uiAction?: UIAction;
  onRollbackClick?: () => void;
}
function refreshPage() {
  location.reload();
}

function renderRollbackContent(props: InstalledVersionProps) {
  if (!props.uiAction) {
    return null;
  }
  const { uiAction } = props;
  let disabled = false;
  let rollbackContent = <Trans>Rollback</Trans>;
  if (uiAction.type === "UIReset") {
    switch (uiAction.action) {
      case UIActions.Started:
        disabled = true;
        rollbackContent = <Trans>Rolling back...</Trans>;
        break;
      case UIActions.Error:
        disabled = true;
        rollbackContent = <Trans>Rollback Failed!</Trans>;
        break;
    }
  } else if (
    uiAction.type !== "" &&
    uiAction.action !== UIActions.Completed &&
    uiAction.action !== UIActions.Error
  ) {
    disabled = true;
  }
  return (
    <button
      id="uiDetailsRollback"
      className="button button-primary-link"
      onClick={props.onRollbackClick}
      disabled={disabled}
    >
      {rollbackContent}
    </button>
  );
}

const InstalledVersion = (props: InstalledVersionProps) => {
  const { uiMetaData } = props;
  if (!uiMetaData || !uiMetaData.clientBuild) {
    return null;
  }
  const { clientBuild, serverBuild } = uiMetaData;

  let refreshForUpdateContent = null;

  let coercedClientBuild = semver.coerce(clientBuild);
  let coercedServerBuild = semver.coerce(serverBuild || "");
  let displayVersion =
    coercedClientBuild === null
      ? uiMetaData.clientBuild
      : coercedClientBuild.raw;

  if (
    coercedClientBuild !== null &&
    coercedServerBuild != null &&
    coercedClientBuild.raw !== coercedServerBuild.raw
  ) {
    refreshForUpdateContent = (
      <button
        id="uiDetailsRefreshVersion"
        className="button button-primary-link"
        onClick={refreshPage}
      >
        <Trans>Refresh page to load</Trans> ({coercedServerBuild.raw})
      </button>
    );
  }

  return (
    <div>
      <ConfigurationMapRow key="installedVersion">
        <ConfigurationMapLabel>
          <Trans>Installed Version</Trans>
        </ConfigurationMapLabel>
        <ConfigurationMapValue>{displayVersion}</ConfigurationMapValue>
        {refreshForUpdateContent}
        {renderRollbackContent(props)}
      </ConfigurationMapRow>
    </div>
  );
};

export default InstalledVersion;
