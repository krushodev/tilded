import { Route, Switch, Redirect } from 'wouter';
import { useAuthStore } from '@/store/auth.store';
import { ToastProvider } from '@/contexts/ToastContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <ToastProvider>
      <Switch>
        <Route path="/login">{!isAuthenticated ? <Login /> : <Redirect to="/" />}</Route>

        <Route path="/register">{!isAuthenticated ? <Register /> : <Redirect to="/" />}</Route>

        <Route path="/settings">{isAuthenticated ? <ProfilePage /> : <Redirect to="/login" />}</Route>

        <Route path="/">{isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}</Route>

        <Route>
          <Redirect to={isAuthenticated ? '/' : '/login'} />
        </Route>
      </Switch>
    </ToastProvider>
  );
}

export default App;
