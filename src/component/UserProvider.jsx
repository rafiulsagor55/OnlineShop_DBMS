import { useRef, useState } from "react";
import { UserContext } from "./UserContext";

// 2. Context Provider
export function UserProvider({ children }) {
  const [searchItem, setSearchItem] = useState("");
  const [updateArrows, setUpdateArrows] = useState(null); 
  const updateArrowsRef = useRef(null);
  return (
    <UserContext.Provider value={{ searchItem, setSearchItem ,updateArrows, setUpdateArrows,updateArrowsRef}}>
      {children}
    </UserContext.Provider>
  );
}
