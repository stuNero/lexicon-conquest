import { BrowserRouter } from "react-router-dom";
import Header from "./partials/Header";
import Main from "./partials/Main";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main />
    </BrowserRouter>
  );
}

export default App;