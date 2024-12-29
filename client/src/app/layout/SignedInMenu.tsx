import { Button, Fade, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";

export default function SignedInMenu() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.account); // 通过Redux的useAppSelector钩子从全局state中提取account分片状态，从account分片中提取 user 属性

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                color='inherit'    // 颜色将继承自其父组件的
                onClick={handleClick}
                sx={{ typography: 'h6' }}
            >
             {user?.email}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My orders</MenuItem>
                <MenuItem onClick={() => dispatch(signOut())}>Logout</MenuItem>
            </Menu>
        </>
    );
}