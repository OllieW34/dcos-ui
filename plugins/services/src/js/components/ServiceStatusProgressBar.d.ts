import React from "react";
import Pod from "../structs/Pod";
import Service from "../structs/Service";
import ServiceTree from "../structs/ServiceTree";

interface ServiceStatusProgressBarProps {
  service: Service | ServiceTree | Pod;
}

export default class ServiceStatusProgressBar extends React.Component<ServiceStatusProgressBarProps> {}
