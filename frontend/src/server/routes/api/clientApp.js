import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import {Helmet} from "react-helmet";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import routes from '../../../app/routes';
import reducers from '../../../app/reducers';
import { Router, browserHistory, createMemoryHistory } from 'react-router';
import promise from 'redux-promise';
import { ServerStyleSheet } from 'styled-components';

exports.reactRouterHandle = function(req, res, next) {
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {
            //new redux store instance
            const createStoreWithMiddleware = applyMiddleware(promise)(
                createStore
            );

            const store = createStoreWithMiddleware(reducers);

            const history = createMemoryHistory(req.url);

            fetchComponentData(
                store.dispatch,
                renderProps.components,
                renderProps.params
            ).then(renderAndSend(history, res, store));
        }
    );
};

function renderAndSend(history, resObj, store) {
    //styled components
    const sheet = new ServerStyleSheet();

    const initRender = renderToString(
        sheet.collectStyles(
            <Provider store={store}>
                <Router history={history} routes={routes} />
            </Provider>
        )
    );
    const helmet = Helmet.rewind();

    const css = sheet.getStyleTags();

    const initState = JSON.stringify(store.getState());
    resObj.render('index', { layout: false, initRender, initState, css, helmet });
}

function fetchComponentData(dispatch, components, params) {
    console.log('components:', components);

    const needs = components.reduce((prev, current) => {
        return (current.needs || [])
            .concat(
                (current.WrappedComponent
                    ? current.WrappedComponent.needs
                    : []) || []
            )
            .concat(prev);
    }, []);

    const promises = needs.map(need => dispatch(need(params)));
    return Promise.all(promises);
}
