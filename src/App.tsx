import { useState } from 'react';
import { 
  FluentProvider, 
  webLightTheme, 
  webDarkTheme, 
  Switch,
  makeStyles
} from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { JewelryGalleryPage } from './pages/JewelryGalleryPage';
import './App.css';

// Create styles using makeStyles for better compatibility
const useStyles = makeStyles({
  appContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    padding: '1rem',
    margin: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    width: '100%',
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '4px',
  },
  contentContainer: {
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  infoMessage: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '12px',
    opacity: 0.8,
  }
});

function App() {
  const styles = useStyles();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} style={{ width: '100vw', maxWidth: '100vw' }}>
      <div className={styles.appContainer}>
        <div className={styles.header}>
          <h1>Order Management - Jewelry Gallery</h1>
          <div className={styles.themeToggle} style={{
            backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(240, 240, 240, 0.5)'
          }}>
            <WeatherSunnyRegular />
            <Switch 
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <WeatherMoonRegular />
            <span style={{ marginLeft: '4px', fontSize: '14px' }}>
              {isDarkMode ? 'Dark' : 'Light'} Mode
            </span>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <JewelryGalleryPage />
        </div>
        <div className={styles.infoMessage}>
          <span>Design image quality remains the same in both modes</span>
        </div>
      </div>
    </FluentProvider>
  )
}

export default App
