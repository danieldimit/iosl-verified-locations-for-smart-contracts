import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { themeVariables } from '../themeVariables';

export default class App extends Component {
    render() {
        return (
            <div>
                <ThemeProvider theme={themeVariables}>
                    {this.props.children}
                </ThemeProvider>
            </div>
        );
    }
}
