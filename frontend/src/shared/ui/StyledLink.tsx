import React, { forwardRef } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as NextUILink, LinkProps as NextUILinkProps } from "@nextui-org/react";

type StyledLinkProps = RouterLinkProps & NextUILinkProps;

const StyledLink = forwardRef<HTMLAnchorElement, StyledLinkProps>((props, ref) => {
    return <NextUILink as={RouterLink} ref={ref} {...props} />;
});

StyledLink.displayName = "StyledLink";

export default StyledLink;
