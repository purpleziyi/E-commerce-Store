 
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
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
  
  return ( //以下排版将header所在appbar设置为没有margin，又将catalog子组件放入了container中使之置于页面中心
    <ThemeProvider theme={theme}>
      <CssBaseline />  
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        < Outlet  />  
      </Container>
    </ThemeProvider>
  )
}
export default App
