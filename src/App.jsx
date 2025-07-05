import { Link } from "react-router-dom";
import styles from "./component/Home.module.css";
import { useContext } from "react";
import { UserContext } from "./component/UserContext";

function App() {
  let email=null; 
  const {userEmail}=useContext(UserContext);
  if(userEmail!=null){
    email=userEmail.email;
  }
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to Our Chatbox</h1>
        <p className={styles.description}>Choose an option to explore our features:</p>
        <div className={styles.options}>
          <Link to={email ? "/demo" : "/login"} className={styles.optionCard}>
            <h2>Online Chat</h2>
            <p>Real-time chat for effective collaboration.</p>
          </Link>

          <Link to="/clipboard" className={styles.optionCard}>
            <h2>Online Clipboard</h2>
            <p>Quickly copy, save, and share your notes.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;