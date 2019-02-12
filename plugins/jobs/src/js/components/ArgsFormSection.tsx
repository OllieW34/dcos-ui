import { Trans } from "@lingui/macro";
import React, { Component } from "react";
import { Tooltip } from "reactjs-components";

import AddButton from "#SRC/js/components/form/AddButton";
import DeleteRowButton from "#SRC/js/components/form/DeleteRowButton";
import Icon from "#SRC/js/components/Icon";
import FieldAutofocus from "#SRC/js/components/form/FieldAutofocus";
import FieldInput from "#SRC/js/components/form/FieldInput";
import FieldLabel from "#SRC/js/components/form/FieldLabel";
import FormGroup from "#SRC/js/components/form/FormGroup";
import FormRow from "#SRC/js/components/form/FormRow";

interface ArgsProps {
  data: string[];
  type: string;
  onAddItem: () => any;
  onRemoveItem: () => any;
  onChangeArrayItem: (value: any, type: string, index: number) => void;
}

class ArgsSection extends Component<ArgsProps, object> {
  constructor(props) {
    super(props);
    this.onChangeIndex = this.onChangeIndex.bind(this);
  }

  onChangeIndex(index: number) {
    return (e: any) => {
      const { onChangeArrayItem } = this.props;
      const newValue = e.target.value;
      onChangeArrayItem(newValue, "args", index);
    };
  }

  getArgsLabel() {
    const tooltipContent = (
      <Trans render="span">
        An array of strings that represents an alternative mode of specifying
        the command to run. This was motivated by safe usage of containerizer
        features like a custom Docker ENTRYPOINT. Either `cmd` or `args` must be
        supplied. It is invalid to supply both `cmd` and `args` in the same job.
      </Trans>
    );

    return (
      <FieldLabel>
        <Trans render="span">Args</Trans>
        <Tooltip
          content={tooltipContent}
          interactive={true}
          maxWidth={300}
          wrapText={true}
        >
          <Icon color="light-grey" id="circle-question" size="mini" />
        </Tooltip>
      </FieldLabel>
    );
  }

  getArgsInputs() {
    const { data, type } = this.props;

    if (data.length === 0) {
      return (
        <FormRow>
          <FormGroup className="column-10">{this.getArgsLabel()}</FormGroup>
        </FormRow>
      );
    }

    return data.map((item, index) => {
      let label = null;
      if (index === 0) {
        label = this.getArgsLabel();
      }

      return (
        <FormRow key={`${type}.${index}`}>
          <FormGroup className="column-12">
            {label}
            <FieldAutofocus>
              <FieldInput
                onChange={this.onChangeIndex(index)}
                name={`${type}.${index}`}
                value={item}
              />
            </FieldAutofocus>
          </FormGroup>
          <FormGroup hasNarrowMargins={true} applyLabelOffset={index === 0}>
            <DeleteRowButton
              onClick={this.props.onRemoveItem.bind(this, {
                type,
                value: index
              })}
            />
          </FormGroup>
        </FormRow>
      );
    });
  }

  render() {
    const { type } = this.props;

    return (
      <div className="form-section">
        {this.getArgsInputs()}
        <FormRow>
          <FormGroup className="column-12">
            <AddButton
              onClick={this.props.onAddItem.bind(this, {
                type
              })}
            >
              <Trans render="span">Add Arg</Trans>
            </AddButton>
          </FormGroup>
        </FormRow>
      </div>
    );
  }
}

export default ArgsSection;
