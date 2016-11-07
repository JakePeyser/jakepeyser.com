import React from 'react';
import Helmet from 'react-helmet';
import NavbarContainer from './navbar/NavbarContainer';
import Footer from './Footer';

/* Material Theme components */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

export default ({ children }) => (
  <MuiThemeProvider>
    <div id="main">
      <Helmet
        defaultTitle="Jake Peyser"
        titleTemplate="Jake Peyser | %s"
      />
      <NavbarContainer />
      <div id="content-wrapper">
        <div id="content">
          { children }
        </div>
      </div>
      <Footer />
    </div>
  </MuiThemeProvider>
);
