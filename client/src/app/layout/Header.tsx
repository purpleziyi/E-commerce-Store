import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
]

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' },
]

const navStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'  // configure mouse-hovering state
    },
    '&:active': {
        color: 'text.secondary'
    }
}

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function  Header({darkMode, handleThemeChange}: Props){
    const {basket} = useStoreContext();  // get basket from context

    // 计算购物车的物品数目。reduce用于将数组中的所有元素归约为一个单一的值,sum 是累加器，保存着归约后的值，0 是累加器的初始值
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)  

    return (
        <AppBar position="static" sx={{ mb: 4, backgroundColor: '#ba68c8' }} >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>   {/*导航栏的布局设置*/}
                <Box>
                    <Typography variant="h6" component={NavLink} 
                        to ='/'
                        sx={navStyles}
                    >
                        Purple Store
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />  {/*darkMode控制组件*/}
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({title, path}) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>  {/*midlinks和rightlinks中间的购物车标志*/}
                        <Badge badgeContent={itemCount} color='secondary'>  {/* 购物车中存储的item数目*/}
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
 
                    <List sx={{ display: 'flex' }}>
                        {rightLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>

        </AppBar>
    )
}