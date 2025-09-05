import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { JewelryGalleryPage } from './pages/JewelryGalleryPage';
import './App.css';

function App() {
  return (
    <FluentProvider theme={webLightTheme} style={{ width: '100%', maxWidth: '100%' }}>
      <div className="App">
        <h1>Order Management - Jewelry Gallery</h1>
        <div className="full-width-container">
          <JewelryGalleryPage />
        </div>
      </div>
    </FluentProvider>
  )
}

export default App
