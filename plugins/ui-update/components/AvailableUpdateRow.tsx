import { Trans } from "@lingui/macro";
import * as React from "react";

import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import { UIAction, UIActions } from "#PLUGINS/ui-update/types/UIAction";
import { FormattedPackageVersion } from "#PLUGINS/ui-update/types/FormattedPackageVersion";

export interface AvailableUpdateRowProps {
  latestVersion: FormattedPackageVersion | null;
  uiAction: UIAction;
  onUpdateClick: (version: string) => void;
}

class AvailableUpdateRow extends React.PureComponent<
  AvailableUpdateRowProps,
  {}
> {
  constructor(props: AvailableUpdateRowProps) {
    super(props);
    this.renderAction = this.renderAction.bind(this);
    this.updateClick = this.updateClick.bind(this);
  }

  updateClick() {
    if (this.props.latestVersion !== null) {
      this.props.onUpdateClick(this.props.latestVersion.version);
    }
  }

  renderAction() {
    const { uiAction } = this.props;
    let disabled = false;
    let content = <Trans>Start Update</Trans>;
    if (uiAction.type === "UIUpdate") {
      disabled = true;
      switch (uiAction.action) {
        case UIActions.Completed:
          content = <Trans>Update Complete</Trans>;
          break;
        case UIActions.Started:
          content = <Trans>Updating...</Trans>;
          break;
        case UIActions.Error:
          content = <Trans>Update Failed!</Trans>;
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
        id="uiDetailsStartUpdate"
        className="button button-primary-link"
        onClick={this.updateClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  render() {
    const { latestVersion } = this.props;
    if (latestVersion === null) {
      return null;
    }
    const displayVersion =
      latestVersion.display !== null
        ? latestVersion.display.raw
        : latestVersion.version;

    return (
      <ConfigurationMapRow key="ui-update-available">
        <ConfigurationMapLabel>
          <Trans>Available Version</Trans>
        </ConfigurationMapLabel>
        <ConfigurationMapValue>
          {displayVersion} (<Trans>New</Trans>)
        </ConfigurationMapValue>
        {this.renderAction()}
      </ConfigurationMapRow>
    );
  }
}

export default AvailableUpdateRow;
