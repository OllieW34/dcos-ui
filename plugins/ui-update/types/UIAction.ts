export interface UIAction {
  type: string;
  action: UIActions;
  value: string;
}

export enum UIActions {
  None = "",
  Started = "start",
  Completed = "complete",
  Error = "error"
}

export const EMPTY_ACTION: UIAction = {
  type: "",
  action: UIActions.None,
  value: ""
};
