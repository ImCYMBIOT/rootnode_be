import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LearnRoute from "./pages/LearnRoute";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import ArticleDetail from "../components/Articles/ArticleDetail";
import ArchivesPage from "./pages/Archivespage";
import Streamspage from "./pages/Streamspage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/learn" element={<LearnRoute />} />
				<Route path="/login" element={<Loginpage />} />
				<Route path="/register" element={<Registerpage />} />
				<Route path="/articles/:id" element={<ArticleDetail />} />
				<Route path="/archives/" element={<ArchivesPage />} />
				<Route path="/archives/:id" element={<ArchivesPage />} />
				<Route path="/stream" element={<Streamspage />} />
				{/* <Route path="/stream/:id" element={<Streamspage />} /> */}
			</Routes>
		</Router>
	);
}

export default App;
