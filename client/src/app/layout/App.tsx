 
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const {setBasket} = useStoreContext();
  const [loading, setLoading] = useState(true);

  // get the basket based on the cookie
  useEffect(() => {
    const buyerId = getCookie('buyerId');  // 先检查一下或拿到buyerId
    if(buyerId){
      agent.Basket.get()
        .then(basket => setBasket(basket))  // 从API中拿到basket，然后用setBasket方法传入basket
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false);  // 如果没有buyerId，那就不必load任何东西
    }
  },[setBasket])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {  // 调整light模式下的页面背景色由纯白色变为灰色
        default: paletteType === 'light' ? '#eaeaea' : '#121212'  
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if(loading) return <LoadingComponent message="Initialising app..."/> 
  
  return ( //以下排版将header所在appbar设置为没有margin，又将catalog子组件放入了container中使之置于页面中心
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />  
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        < Outlet  />  
      </Container>
    </ThemeProvider>
  )
}
export default App
