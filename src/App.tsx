import { useState } from 'react';
import { 
  FluentProvider, 
  webLightTheme, 
  webDarkTheme, 
  Button,
  Switch,
  tokens
} from '@fluentui/react-components';
import { WeatherMoon, WeatherSunny } from '@fluentui/react-icons';
import { JewelryGalleryPage } from './pages/JewelryGalleryPage';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} style={{ width: '100%', maxWidth: '100%' }}>
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1>Order Management - Jewelry Gallery</h1>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px', 
            borderRadius: '4px',
            backgroundColor: isDarkMode ? tokens.colorNeutralBackground2 : tokens.colorNeutralBackground1
          }}>
            <WeatherSunny />
            <Switch 
              checked={isDarkMode}
              onChange={toggleTheme}
              label={{ position: 'hidden', children: 'Toggle Dark Mode' }}
            />
            <WeatherMoon />
            <span style={{ marginLeft: '4px', fontSize: '14px' }}>
              {isDarkMode ? 'Dark' : 'Light'} Mode
            </span>
          </div>
        </div>
        <div className="full-width-container">
          <JewelryGalleryPage />
        </div>
        <div style={{ 
          position: 'fixed', 
          bottom: '16px', 
          right: '16px', 
          backgroundColor: 'transparent', 
          padding: '8px', 
          borderRadius: '8px',
          fontSize: '12px',
          opacity: 0.8
        }}>
          <span>Design image quality remains the same in both modes</span>
        </div>
      </div>
    </FluentProvider>
  )
}

export default App
