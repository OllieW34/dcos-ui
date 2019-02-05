import React from "react";

interface NestedServiceLinksProps {
  serviceLink: string;
  serviceID: string;
  className?: any;
  majorLinkAnchorClassName?: any;
  majorLinkClassName?: any;
  minorLinkAnchorClassName?: any;
  minorLinkClassName?: any;
  minorLinkWrapperClassName?: any;
}

export class Header extends React.Component<NestedServiceLinksProps> {}
