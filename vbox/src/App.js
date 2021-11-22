import { Switch, Route } from "react-router-dom";
import { About } from "./pages/about/about";

import Home from "./pages/home/home";
import Waitlist from "./pages/waitlist/waitlist";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/about" component={About}/>
      <Route exact path="/join" component={Waitlist}/>
    </Switch>
  );
}

export default App;
