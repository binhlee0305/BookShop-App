import React from 'react';
import './App.css';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagePage } from './layouts/MessagesPage/MessagePage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const history = useHistory();
  
  const customAuthHandler = () => {
    history.push('/login');
  }

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };


  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />

        <div className='flex-grow-1'>
          <Switch>
            {/* exact means path only have path='/' accepted */}
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>
            <Route path='/home'>
              <HomePage />
            </Route>
            <Route path='/search'>
              <SearchBooksPage />
            </Route>
            <Route path='/reviewList/:bookId'>
              <ReviewListPage/>
            </Route>
            <Route path='/checkout/:bookId'>
              <BookCheckoutPage />
            </Route>
            <Route path='/login' 
              render={() => <LoginWidget config={oktaConfig} /> }
            />
            <Route path='/login/callback' component={LoginCallback} />
            
            <SecureRoute path="/shelf"><ShelfPage/></SecureRoute>

            <SecureRoute path="/messages"><MessagePage/></SecureRoute>

            <SecureRoute path="/admin"><ManageLibraryPage/></SecureRoute>
          </Switch>
        </div>

        <Footer />
      </Security>
    </div>
  );
}


