import React from "react";
import {Navbar as Nav, NavbarBrand, NavbarContent, NavbarItem, Button, Switch} from "@nextui-org/react";
import StyledLink from "../../shared/ui/StyledLink";
import {useLocation} from "react-router-dom";
import ThemeSwitch from "../../shared/ui/ThemeSwitch";


export default function Navbar() {
    const location = useLocation();

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <Nav isBordered
             classNames={{
                 item: [
                     "flex",
                     "relative",
                     "h-full",
                     "items-center",
                     "data-[active=true]:after:content-['']",
                     "data-[active=true]:after:absolute",
                     "data-[active=true]:after:bottom-0",
                     "data-[active=true]:after:left-0",
                     "data-[active=true]:after:right-0",
                     "data-[active=true]:after:h-[2px]",
                     "data-[active=true]:after:rounded-[2px]",
                     "data-[active=true]:after:bg-primary",
                 ],
             }}>
            <NavbarBrand>
                <ThemeSwitch/>
                <p className="font-bold text-inherit">Ad Moderator</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={isActive("/")}>
                    <StyledLink to="/">
                        About
                    </StyledLink>
                </NavbarItem>
                <NavbarItem isActive={isActive("/integration")}>
                    <StyledLink to="/integration">
                        API
                    </StyledLink>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex"  isActive={isActive("/history")}>
                    <StyledLink to="/history">History</StyledLink>
                </NavbarItem>
                <NavbarItem isActive={isActive("/analyze")}>
                    <Button as={StyledLink} color="primary" to="/analyze" variant="flat">
                        Analyze
                    </Button>
                </NavbarItem>
            </NavbarContent>

        </Nav>
    );
}
